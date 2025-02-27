# 🚗 Toll Management System - Toll Connect
![Deno](https://img.shields.io/badge/Deno-v1.x-green?logo=deno)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![Documentation](https://img.shields.io/badge/Documentation-Yes-brightgreen)

> Interoperable Toll Management & Data Analysis System.

## 📜 Table of Contents
- [📝 Introduction](#-introduction)
- [📌 Prerequisites](#-prerequisites)
- [⚙ Installation and Setup](#-installation-and-setup)
- [🚀 Running the Project](#-running-the-project)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [CLI Setup](#cli-setup)
- [🐳 Dockerized Version](#-dockerized-version)
- [📜 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [👨‍💻 Authors](#-authors)

---

## 📝 Introduction
📌 This project is the semester assignment for the **Software Engineering** course of the **ECE NTUA** program, conducted in the **7th Semester**.
Toll Connect is a software system for toll interoperability, managing transactions between different toll operators, settling financial obligations, and analyzing toll usage data.

The system consists of:
- **Backend**: REST API for handling toll transactions and interoperability.
- **Frontend**: Web-based interface for data visualization and analysis.
- **CLI Tool**: Administrator utility for managing toll transactions and generating reports.

📄 **Full Documentation SRS**: [here](https://github.com/ntua/softeng24-17/blob/main/documentation/SRS%20softeng24-17.docx)

## 📌 Prerequisites
Ensure you have the following installed:
- [Deno](https://deno.com/)
- [Docker (Windows)](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker (Linux)](https://docs.docker.com/engine/install/debian/#install-using-the-repository)

## ⚙ Installation and Setup
### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/softeng24-17.git
cd softeng24-17
```

### 2. Create and Import the Database
```bash
cd back-end
deno task db-create # Initializes the database
deno ...
```

## 🚀 Running the Project

### Backend Setup
Start the backend server:
```bash
cd back-end
deno task ...
```
The API will be available at: `http://localhost:9115/api`

### Frontend Setup
Run the web application:
```sh
cd front-end
deno ...
```
Access it at: `http://localhost:3000`

### CLI Setup
Compile and run the CLI tool:
```bash
cd cli-client
deno task compile
./se2417 --help
```
📄 CLI Documentation: [here](https://github.com/ntua/softeng24-17/blob/main/cli-client/README.md)

## 🐳 Dockerized Version
To run the entire system using Docker Compose:
```bash
docker compose build
docker compose up -d
```
The API is exposed on port `9115`, and Apache serves the frontend on port `80`.

## 📜 API Documentation
API reference available at:
📌 `http://localhost:9115/api/docs`

Documentation includes:
- ✔ OpenAPI 3.0 (YAML / JSON)
- ✔ Postman Collection

## 🧪 Testing
To execute CLI unit tests:
```bash
cd cli-client
deno task test
```

## 👨‍💻 Authors
- [Giorgos Karapidakis](https://github.com/)
- [Giorgos Doudounakis](https://github.com/)
- [Giannis Polychornopoulos](https://github.com/JohnnyPol)
- [Katerina Michou](https://github.com/katemich)
- [Angeliki Ntalapera](https://github.com/AngelikiNt)
- [Dimitris Balatos](https://github.com/)
