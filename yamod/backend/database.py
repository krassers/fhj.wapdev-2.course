from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

DATABASE = Path(__file__).parent / "yamod.db"
engine = create_engine(f"sqlite:///{DATABASE}", connect_args={"check_same_thread": False})


def create_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
