"""Empty the database and load IMDB-Movie-Data.csv: python seed.py"""

import csv
from datetime import date
from pathlib import Path

from sqlmodel import Session, SQLModel, select

from database import engine
from models import Genre, Movie, Person

CSV = Path(__file__).parent / "IMDB-Movie-Data.csv"


def get_or_create(session: Session, model, name: str):
    item = session.exec(select(model).where(model.name == name)).first()
    if item is None:
        item = model(name=name)
        session.add(item)
        session.flush()
    return item


def names(value: str) -> list[str]:
    return [name.strip() for name in value.split(",")]


def seed() -> None:
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session, CSV.open(encoding="utf-8", newline="") as file:
        for row in csv.DictReader(file):
            actors = [get_or_create(session, Person, name) for name in names(row["Actors"])]
            director = get_or_create(session, Person, row["Director"].strip())
            genres = [get_or_create(session, Genre, name) for name in names(row["Genre"])]
            year = int(row["Year"])
            revenue = row["Revenue (Millions)"].strip()
            session.add(
                Movie(
                    rank=int(row["Rank"]),
                    title=row["Title"].strip(),
                    description=row["Description"].strip(),
                    released=date(year, 1, 1),
                    year=year,
                    run_time=int(row["Runtime (Minutes)"]),
                    rating=float(row["Rating"]),
                    revenue=float(revenue) if revenue else None,
                    director=director,
                    genres=genres,
                    actors=actors,
                )
            )
        session.commit()

        movies = len(session.exec(select(Movie)).all())
        genres = len(session.exec(select(Genre)).all())
        persons = len(session.exec(select(Person)).all())
    print(f"Loaded {movies} movies, {genres} genres, {persons} persons.")


if __name__ == "__main__":
    seed()
