from pydantic import BaseModel, ConfigDict, field_validator


class TodoCreate(BaseModel):
    title: str
    description: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("title must not be blank")
        return cleaned


class TodoPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("title must not be blank")
        return cleaned


class TodoOut(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool

    model_config = ConfigDict(from_attributes=True)
