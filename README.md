# JavaScript Web App: Store Simulation
Dynamic web application implementing NodeJs and RESTful APIs on backend and with JQuery and AJAX on frontend. 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Instructions](#instructions)


## Introduction
This repository contains a JavaScript web application that simulates an online store. The app is built using Node.js for the server-side implementation, MongoDB as the database, and incorporates RESTful APIs for communication between the client and server. The front end of the application utilizes AJAX for dynamic content loading.

## Features

- Browse and search through a MongoDB database containing various items available for purchase.
- Interactive and user-friendly front end with dynamic content loading using AJAX.
- Server-side implementation using Node.js to handle requests and serve data.
- RESTful API architecture for seamless communication between the client and server.
- Smooth user experience with real-time updates and minimal page reloads.

## Getting Started
### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB: Install and set up MongoDB on your machine. Visit [mongodb.com](https://www.mongodb.com/) for installation instructions.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/dpaisley98/WebApp.git


## Instructions

- First, ensure that you have a database called CA4. If you do, it will create the collection for you if you haven't already.
- To run the server, use the command `npm start`. This will call the `index.js` file and start a server on port 8080.
- Access the server by going to `localhost:8080`. This will display the home interface.
- The search at the top handles keywords and queries the database using regex, allowing flexibility in wording.
- Check the category checkboxes to narrow the search scope; by default, only the title is checked.
- After receiving results, they will be presented in a table format.
- Click on an item to view more details on a new page.
- On the item details page, click the "Edit" button to modify field values. Once satisfied, confirm the changes.
- Use the "Delete" button to remove an item from the database.
- From the home page, navigate to the "Create Product" page to add a new item.
- When adding images, separate each image URL with a "," as it distinguishes different images.


