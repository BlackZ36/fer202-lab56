import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [completedFilter, setCompletedFilter] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [count, setCount] = useState(0);

  // useEffect to load users from API
  useEffect(() => {
    axios
      .get("http://localhost:9999/user")
      .then((response) => {
        setUsers(response.data); // Assuming response data is an array of user names
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, []);

  // useEffect to load todos from API
  useEffect(() => {
    axios
      .get("http://localhost:9999/todo")
      .then((response) => {
        setTodos(response.data); // Assuming response data is an array of todos
      })
      .catch((error) => {
        console.error("Error loading todos:", error);
      });
  }, [completedFilter]);

  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) => (prevSelected.includes(parseInt(userId)) ? prevSelected.filter((u) => parseInt(u) !== parseInt(userId)) : [...prevSelected, parseInt(userId)]));
  };

  // Hàm xử lý khi thay đổi bộ lọc trạng thái hoàn thành
  const handleCompletedFilter = (status) => {
    setCompletedFilter(status);
  };

  const handleSortByTitle = () => {
    setIsAscending((prevState) => !prevState); // Đảo ngược trạng thái sắp xếp
  };

  // Lọc các todos dựa trên người dùng đã chọn và trạng thái hoàn thành
  const filteredTodos = todos
    .filter((todo) => {
      const matchUser = selectedUsers.length === 0 || selectedUsers.includes(parseInt(todo.userId)); // Ép kiểu và so sánh
      const matchStatus = completedFilter === "all" || (completedFilter === "finished" && todo.completed) || (completedFilter === "unfinished" && !todo.completed);

      return matchUser && matchStatus; // Trả về true nếu thỏa cả hai điều kiện
    })
    .sort((a, b) => {
      // Sắp xếp theo title dựa trên trạng thái isAscending
      if (isAscending) {
        return a.title.localeCompare(b.title); // Sắp xếp tăng dần
      }
    });

  const getUserName = (userId) => {
    const user = users.find((user) => parseInt(user.id) === parseInt(userId)); // Ép kiểu về integer
    return user ? user.name : "Unknown"; // Trả về 'Unknown' nếu không tìm thấy user
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Todo List</h1>
        </Col>
      </Row>
      <Row>
        {/* Left side - Todo List */}
        <Col md={8}>
          <div className=" mb-2">
            <p>
              Sort:
              <Button className="mx-3" onClick={handleSortByTitle}>
                Ascending by Title
              </Button>
            </p>
            <div>
              Count:
              <span className="mx-2">{filteredTodos.length}</span>
            </div>
          </div>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>User</th>
                <th>Completed</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map((todo, index) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>{getUserName(todo.userId)}</td>
                  <td>
                    <span style={{ color: todo.completed ? "blue" : "red" }}>{todo.completed ? "Finished" : "Unfinished"}</span>
                  </td>
                  <td>
                    <Button variant="success">Change</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Right side - Filter */}
        <Col md={4}>
          <h4>Users</h4>
          {users.map((user) => (
            <Form.Check key={user.id} type="checkbox" label={user.name} onChange={() => handleUserChange(user.id)} />
          ))}

          <h4 className="mt-4">Completed</h4>
          <Form.Check type="radio" label="Finished" name="completedFilter" onChange={() => handleCompletedFilter("finished")} />
          <Form.Check type="radio" label="Unfinished" name="completedFilter" onChange={() => handleCompletedFilter("unfinished")} />
          <Form.Check type="radio" label="All" name="completedFilter" onChange={() => handleCompletedFilter("all")} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
