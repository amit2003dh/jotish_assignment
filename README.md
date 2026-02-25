## Jotish Assignment

## Employee Management System

A modern React + TypeScript web application for managing employee data with authentication, visualization, and real-time photo capture.

Designed with scalability, UX clarity, and production-readiness in mind.

##  Key Highlights

 Secure Authentication (testuser / Test123)

 Employee Data from External REST API

 WebRTC Camera Integration (Photo Capture + Download)

 Interactive Salary Bar Charts

 Live Geographic Employee Map

 Modern Gradient UI with Responsive Layout

 Clean Architecture & Component-Based Structure

##  Tech Stack

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| Framework       | React 18 (CRA)                |
| Language        | TypeScript 4.9                |
| Routing         | React Router                  |
| API             | Axios                         |
| Charts          | Chart.js + react-chartjs-2    |
| Maps            | Leaflet + react-leaflet       |
| Styling         | CSS3 (Gradients + Animations) |
| Build           | react-scripts                 |
| Package Manager | npm                           |

## Project Structure

src/
  components/
    Login.tsx
    List.tsx
    Details.tsx
    PhotoResult.tsx
    BarChart.tsx
    MapView.tsx
  utils/
    api.ts
  App.tsx
public/
  index.html

## Authentication

### Login Credentials

Username: testuser
Password: Test123

## API Integration

### Endpoint

POST https://backend.jotish.in/backend_dev/gettabledata.php

Payload

{
  "username": "test",
  "password": "123456"
}

Handles:

Async data fetching

Error states

Loading states

Data transformation

## Visual Features
### Salary Distribution (Bar Chart)

Displays salary data of first 10 employees

Animated rendering

Responsive scaling

Geographic Distribution (Map)

City-wise employee grouping

Interactive markers

OpenStreetMap integration

 Photo Capture

WebRTC camera access

Live preview

Snapshot capture

Downloadable image

Retake functionality

Note: Camera requires HTTPS in production.

## Development Setup
git clone <https://github.com/amit2003dh/Jotish__Assignment.git>
cd jotish-assignment
npm install
npm start

Open:

http://localhost:3000