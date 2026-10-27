from datetime import date

from sqlmodel import Field, Relationship, SQLModel


class MovieGenreLink(SQLModel, table=True):
    movie_id: int | None = Field(default=None, foreign_key="movie.id", primary_key=True)
    genre_id: int | None = Field(default=None, foreign_key="genre.id", primary_key=True)


class MovieActorLink(SQLModel, table=True):
    movie_id: int | None = Field(default=None, foreign_key="movie.id", primary_key=True)
    person_id: int | None = Field(default=None, foreign_key="person.id", primary_key=True)


class GenreBase(SQLModel):
    name: str = Field(min_length=1, max_length=4096)


class Genre(GenreBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class GenreRead(GenreBase):
    id: int


class PersonBase(SQLModel):
    name: str = Field(min_length=1, max_length=70)


class Person(PersonBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class PersonRead(PersonBase):
    id: int


class MovieBase(SQLModel):
    rank: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=4096)
    description: str
    released: date
    year: int | None = None
    run_time: int = Field(ge=1)
    rating: float = Field(ge=0, le=10)
    revenue: float | None = Field(default=None, ge=0)


class Movie(MovieBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    visible: bool = True
    director_id: int = Field(foreign_key="person.id")

    director: Person = Relationship()
    genres: list[Genre] = Relationship(link_model=MovieGenreLink)
    actors: list[Person] = Relationship(link_model=MovieActorLink)


class MovieWrite(MovieBase):
    director: int
    genres: list[int] = Field(min_length=1)
    actors: list[int] = Field(min_length=1)


class MovieRead(MovieBase):
    id: int
    director: PersonRead
    genres: list[GenreRead]
    actors: list[PersonRead]


class MoviePage(SQLModel):
    items: list[MovieRead]
    total: int
    offset: int
    limit: int
