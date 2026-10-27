from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from sqlmodel import Session, col, func, or_, select

from database import create_tables, get_session
from models import (
    Genre,
    GenreBase,
    GenreRead,
    Movie,
    MovieActorLink,
    MovieGenreLink,
    MoviePage,
    MovieRead,
    MovieWrite,
    Person,
    PersonBase,
    PersonRead,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(title="yamod", lifespan=lifespan)

SessionDep = Annotated[Session, Depends(get_session)]


def get_or_404(session: Session, model, id: int, name: str):
    item = session.get(model, id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"{name} not found")
    return item


# Genres


@app.get("/api/genres/", response_model=list[GenreRead])
def list_genres(session: SessionDep):
    return session.exec(select(Genre).order_by(Genre.id)).all()


@app.get("/api/genres/{id}/", response_model=GenreRead)
def get_genre(id: int, session: SessionDep):
    return get_or_404(session, Genre, id, "Genre")


@app.post("/api/genres/", response_model=GenreRead, status_code=201)
def create_genre(data: GenreBase, session: SessionDep):
    genre = Genre.model_validate(data)
    session.add(genre)
    session.commit()
    session.refresh(genre)
    return genre


@app.put("/api/genres/{id}/", response_model=GenreRead)
def update_genre(id: int, data: GenreBase, session: SessionDep):
    genre = get_or_404(session, Genre, id, "Genre")
    genre.name = data.name
    session.commit()
    session.refresh(genre)
    return genre


@app.delete("/api/genres/{id}/", status_code=204)
def delete_genre(id: int, session: SessionDep):
    genre = get_or_404(session, Genre, id, "Genre")
    used = session.exec(select(MovieGenreLink).where(MovieGenreLink.genre_id == id)).first()
    if used:
        raise HTTPException(
            status_code=409, detail="Genre is still referenced by a movie. Delete the movie first."
        )
    session.delete(genre)
    session.commit()
    return Response(status_code=204)


# Persons


@app.get("/api/persons/", response_model=list[PersonRead])
def list_persons(session: SessionDep, search: str | None = None):
    query = select(Person).order_by(Person.id)
    if search:
        query = query.where(col(Person.name).icontains(search))
    return session.exec(query).all()


@app.get("/api/persons/{id}/", response_model=PersonRead)
def get_person(id: int, session: SessionDep):
    return get_or_404(session, Person, id, "Person")


@app.post("/api/persons/", response_model=PersonRead, status_code=201)
def create_person(data: PersonBase, session: SessionDep):
    person = Person.model_validate(data)
    session.add(person)
    session.commit()
    session.refresh(person)
    return person


@app.put("/api/persons/{id}/", response_model=PersonRead)
def update_person(id: int, data: PersonBase, session: SessionDep):
    person = get_or_404(session, Person, id, "Person")
    person.name = data.name
    session.commit()
    session.refresh(person)
    return person


@app.delete("/api/persons/{id}/", status_code=204)
def delete_person(id: int, session: SessionDep):
    person = get_or_404(session, Person, id, "Person")
    directs = session.exec(select(Movie).where(Movie.director_id == id)).first()
    acts = session.exec(select(MovieActorLink).where(MovieActorLink.person_id == id)).first()
    if directs or acts:
        raise HTTPException(
            status_code=409, detail="Person is still referenced by a movie. Delete the movie first."
        )
    session.delete(person)
    session.commit()
    return Response(status_code=204)


# Movies


def get_visible_movie(session: Session, id: int) -> Movie:
    movie = session.get(Movie, id)
    if movie is None or not movie.visible:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


def lookup(session: Session, model, ids: list[int], name: str) -> list:
    items = []
    for id in ids:
        item = session.get(model, id)
        if item is None:
            raise HTTPException(status_code=422, detail=f"Unknown {name} id {id}")
        items.append(item)
    return items


RELATIONS = {"director", "genres", "actors"}


def save_movie(session: Session, movie: Movie, data: MovieWrite) -> MovieRead:
    movie.sqlmodel_update(data.model_dump(exclude=RELATIONS))
    if movie.year is None:
        movie.year = movie.released.year
    movie.director = lookup(session, Person, [data.director], "director")[0]
    movie.genres = lookup(session, Genre, data.genres, "genre")
    movie.actors = lookup(session, Person, data.actors, "actor")
    session.add(movie)
    session.commit()
    session.refresh(movie)
    return MovieRead.model_validate(movie)


@app.get("/api/movies/", response_model=MoviePage)
def list_movies(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    title: str | None = None,
):
    query = select(Movie).where(Movie.visible)
    if title:
        query = query.where(col(Movie.title).icontains(title))
    total = session.exec(select(func.count()).select_from(query.subquery())).one()
    movies = session.exec(query.order_by(Movie.rank, Movie.id).offset(offset).limit(limit)).all()
    return MoviePage(
        items=[MovieRead.model_validate(movie) for movie in movies],
        total=total,
        offset=offset,
        limit=limit,
    )


@app.get("/api/movies/{id}/", response_model=MovieRead)
def get_movie(id: int, session: SessionDep):
    return MovieRead.model_validate(get_visible_movie(session, id))


@app.post("/api/movies/", response_model=MovieRead, status_code=201)
def create_movie(data: MovieWrite, session: SessionDep):
    return save_movie(session, Movie(), data)


@app.put("/api/movies/{id}/", response_model=MovieRead)
def update_movie(id: int, data: MovieWrite, session: SessionDep):
    return save_movie(session, get_visible_movie(session, id), data)


@app.delete("/api/movies/{id}/", status_code=204)
def delete_movie(id: int, session: SessionDep):
    movie = get_visible_movie(session, id)
    movie.visible = False
    session.commit()
    return Response(status_code=204)
