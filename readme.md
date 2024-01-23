# Chat Project for Virtual Communication Environments Course

## Overview

This repository hosts a web-based chat application, created as part of the Virtual Communication Environments course. The goal of this project is to simulate key functionalities of a typical chat application, similar to WhatsApp, using HTML, CSS, and JavaScript.

Repository: https://github.com/zvizzct/ECV-chat

## Key Components

### 1. Configuration Files

- **js/config/serverConfig.js**: Defines server-related configurations. `SERVER_URL` specifies the WebSocket server URL for the chat service. `ROOM_NAME` sets a default room name for chat sessions.

### 2. Service Layer

- **js/services/chatService.js**: The core service handling chat functionalities. It includes methods for connecting to the server, sending and receiving messages, handling user connections and disconnections, and managing room information. The `ChatService` class uses `SillyClient` for WebSocket communication.

### 3. Utility Classes

- **utils/chatHistory.js**: Manages the chat history for different rooms. It allows adding and retrieving messages, as well as managing user presence in rooms.

- **utils/uiHandler.js**: Responsible for all UI interactions. This includes initializing elements, setting up event listeners, handling user interactions, and dynamically updating the chat UI based on different events.

### 4. Main Application

- **js/app.js**: Integrates services and utilities to create the main chat application functionality. This file contains the `ChatApp` class which sets up event listeners and controls the flow of the application. It manages chat rooms, user connections, message handling, and UI updates.

### 5. Styles and HTML

- **css/style.css**: Contains the CSS styles for the chat application's UI.
- **index.html**: The main HTML file that renders the chat application in the browser.

### 6. Assets

- **assets/chatui**: Holds any static assets used in the UI, such as default images for the chat interface.

## How It Works

1. **Initialization**: On loading the `index.html`, the `ChatApp` class is instantiated, initializing UI components and setting up necessary event listeners.

2. **Connecting to a Chat Room**: Users can join a chat room by entering a username and room name. The `ChatService` connects to the server using WebSocket and joins the specified room.

3. **Chat Interaction**: Users can send and receive messages. The messages are managed by `ChatService` and displayed in the UI by `UIHandler`. `ChatHistory` maintains a record of all messages in each room.

4. **Private Chat**: The application supports initiating private chats with other users, creating separate private chat rooms.

## Personal Information

- **NIA**: 242693
- **Email**: victor.puerta01@estudiant.upf.edu
