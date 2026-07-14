# API CONTRACT
# GET  /api/todos
#   response: [ {"id": number, "title": string, "completed": boolean}, ... ]
# POST /api/todos
#   request:  {"title": string}
#   response: {"id": number, "title": string, "completed": boolean}
# PATCH /api/todos/{id}
#   request:  {"title"?: string, "completed"?: boolean}
#   response: {"id": number, "title": string, "completed": boolean}
# DELETE /api/todos/{id}
#   response: 204 No Content

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoOut, TodoUpdate

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("", response_model=list[TodoOut])
async def list_todos(db: Session = Depends(get_db)) -> list[Todo]:
    return db.query(Todo).order_by(Todo.id.asc()).all()


@router.post("", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
async def create_todo(body: TodoCreate, db: Session = Depends(get_db)) -> Todo:
    todo = Todo(title=body.title, completed=False)
    db.add(todo)
    db.flush()
    return todo


@router.patch("/{todo_id}", response_model=TodoOut)
async def update_todo(todo_id: int = Path(..., ge=1), body: TodoUpdate | TodoCreate = None, db: Session = Depends(get_db)) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail={"error": "todo not found"})
    if isinstance(body, TodoCreate):
        update_data = body.model_dump()
    else:
        update_data = body.model_dump(exclude_unset=True) if body is not None else {}
    if "title" in update_data:
        todo.title = update_data["title"]
    if "completed" in update_data:
        todo.completed = update_data["completed"]
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int = Path(..., ge=1), db: Session = Depends(get_db)) -> None:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail={"error": "todo not found"})
    db.delete(todo)
