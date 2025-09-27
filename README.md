![Hackatime](https://hackatime-badge.hackclub.com/U08HC7N4JJW/Portfolio)

# Portfolio

This repository contains my portfolio website. It is hosted at https://simon.hackclub.app.

## Features

- Showcases projects with images, descriptions, and links
- Displays time spent on each project using the Hackatime API
- Visitors can leave comments on the website
- Cool design

## Installation

1. Clone the Repository
    ```bash
    git clone https://github.com/simon0302010/Portfolio.git
    cd Portfolio
    ```

2. Install requirements
    ```bash
    python3 -m pip install -r requirements.txt
    ```

3. Start the server
    ```bash
    python3 app.py
    ```

The webserver should now be running at http://127.0.0.1:5111

## Environment Variable

To see the time spent coding today you need to set the `HACKATIME_API_KEY` environment variable with your Hackatime API key before running the application. Also remember to change the user ID in all scripts to your own user ID.

**On Linux/macOS:**
```bash
export HACKATIME_API_KEY=your_api_key_here
```

**On Windows (Command Prompt):**
```cmd
set HACKATIME_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Hackatime API key.

## License

This project is licensed under the terms of the [GNU General Public License Version 3](./LICENSE).