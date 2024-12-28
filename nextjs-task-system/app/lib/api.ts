import { TaskT } from "@/db/type";
import { CreateTaskInput, UpdateTaskInput } from "@/db/z-tasks";
import { CreateUserInput, LoginUserInput } from "@/db/z-users";
class Api {
  _baseUrl: string;
  _headers: {
    [name: string]: string;
  };
  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._headers = {
      "Content-type": "application/json",
    };
  }
  _handleResponse(res: Response) {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  }
  getTasks() {
    return fetch(this._baseUrl + "/tasks").then(this._handleResponse);
  }
  createTask(task: CreateTaskInput) {
    return fetch(this._baseUrl + "/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: this._headers,
    }).then(this._handleResponse);
  }
  updateTask(taskId: string, values: UpdateTaskInput) {
    return fetch(this._baseUrl + "/tasks/" + taskId, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: this._headers,
    }).then(this._handleResponse);
  }
  register(data: CreateUserInput) {
    return fetch(this._baseUrl + "/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: this._headers,
    }).then(this._handleResponse);
  }
  login(data: LoginUserInput) {
    return fetch(this._baseUrl + "/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: this._headers,
    }).then(this._handleResponse);
  }
}

export const api = new Api("/api/v1");
