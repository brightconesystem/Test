from pydantic import BaseModel, field_validator


class TodoBase(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("title must not be blank")
        return value.strip()


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if not value.strip():
            raise ValueError("title must not be blank")
        return value.strip()


class TodoOut(BaseModel):
    id: int
    title: str
    completed: bool

    model_config = {"from_attributes": True}
