import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { Navbar, Nav, Container, Button, Row, Col, Card } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

export default function Images() {
  const [images, setImages] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.sub || decoded.identity;
        setUserId(userId);

        const response = await axios.get(`${API_BASE_URL}/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content/images`);
        setImages(response.data.images || []);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };

    fetchUserData();
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/delete/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(images.filter((image) => image.id !== id));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100">
        <Container>
          <Navbar.Brand href="/">cats :3</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href={`${API_BASE_URL}`}>Swagger</Nav.Link>
              <Nav.Link href="/upload">Upload</Nav.Link>
            </Nav>
            {username ? (
              <Nav className="ms-auto">
                <Navbar.Text className="me-3">Welcome, {username}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4 pt-5">
        <h2>Welcome to the cats :3 API showcase</h2>
        <p>
          This website was created to showcase the functionality of the cats :3 API. 
          You can register, log in, upload images of cats, and view images uploaded by other users.
        </p>
        <p>
          For detailed API documentation, please visit the <a href={`${API_BASE_URL}`}>Swagger</a> page.
        </p>
      </Container>
      <Container className="mt-4 pt-5">
        <Row className="g-4">
          {images.length > 0 ? (
            images.map((image) => (
              <Col sm={12} md={6} lg={4} xl={3} key={image.id}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}/content/images/${image.id}/file`}
                    alt={image.name}
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      width: "auto",
                      height: "auto",
                      margin: "0",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{image.name}</Card.Title>
                    <Card.Text>{image.description}</Card.Text>
                    <Card.Text>Uploaded by: {image.username}</Card.Text>
                    {console.log("Logged in user ID:", userId, typeof userId)}
                    {console.log("Image user ID:", image.user_id, typeof image.user_id)}
                    {parseInt(image.user_id) === parseInt(userId) && (
                     <Button variant="danger" onClick={() => handleDelete(image.id)}>
                    Delete
                    </Button>
                  )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No cats found :(</p>
          )}
        </Row>
      </Container>
    </div>
  );
}