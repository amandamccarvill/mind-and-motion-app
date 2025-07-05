# Development Log – Mind & Motion

## Week 1: Project Setup and Early Challenges
In the first week of development, I focused on building the foundational structure for both the backend and frontend. I used Vite with React to scaffold the client and set up the backend using Express, Mongoose, and supporting libraries such as CORS, dotenv, bcrypt, and jsonwebtoken.

### Initial Setup
Frontend:
- Initialized the project using Vite
- Installed necessary dependencies

Backend:
- Created an Express server
- Installed dependencies and set up MongoDB connection
- Created basic routes and middleware

After completing the basic setup, I attempted to test a simple POST request using Thunderclient. However, I encountered a 403 Forbidden error with no detailed feedback. I initially suspected a middleware or CORS issue, but further investigation revealed the actual cause: another process was occupying the same port. By running lsof -i :5000, I discovered that the ControlCe service was listening on port 5000. I changed the backend server to run on port 4000, and the issue was resolved.

### Lessons Learned
1. Port conflicts can produce vague errors, so tools like lsof are helpful in diagnosing hidden issues.
2. Even early-stage configurations require attention to detail and systematic debugging.

Once the basic backend functionality was in place, I built the core authentication flow using JWTs, implemented protected routes, and created endpoints for managing user profiles and favorite items such as affirmations and yoga poses.

I initially planned to use an external API for yoga poses but discovered that the endpoint was no longer available. After searching for alternatives and not finding any suitable replacements, I decided to use .json files and treat them similarly to the meditation sound data. This required manually gathering, formatting, and storing pose information, which although straightforward, proved time-consuming.

## Week 2: Frontend Development and Data Integration
At the start of the second week, I focused on installing Tailwind CSS and setting up page routing for a better user experience. I designed a homepage that introduces the app, followed by /signup and /login routes. Once authenticated, users are taken to the dashboard, where they can access their personalized content, and to a profile page where they can view or update their personal information.

While building the signup and profile views, I realized the app defaulted to greeting users by their email address. This felt impersonal, so I updated the signup and profile update forms to include a user-provided name, which is now stored and displayed.

I also integrated the .json yoga and meditation data into MongoDB as collections and created the necessary backend controllers, routes, and error handling logic to support them.

Challenges and Iteration
One significant issue arose while trying to render the dashboard. It was only loading the affirmation content while silently failing on the other data. I commented out the dashboard sections one by one to identify the problem. This led me to discover that the horoscope API I was using was returning a 503 Service Unavailable error. After further research, I replaced it with a new API available via RapidAPI, which resolved the issue.

Lessons Learned
API reliability is not guaranteed; having a backup plan or a way to pivot is essential.

Incrementally isolating sections of code is an effective way to debug complex component loading issues.

Week 3: UI Improvements and Feature Polishing
Heading into the third week, my focus shifted to refining the user interface and polishing core functionality. The dashboard layout was initially a long scroll of text, which didn’t offer a user-friendly experience. To address this, I restructured the layout into a two-column grid and added collapsible sections for each content area (affirmations, yoga poses, meditation sounds, and horoscopes).

Duplicate Handling in Favorites
Another issue I encountered was the ability to add the same yoga pose, affirmation, or meditation sound to a user’s favorites multiple times. This cluttered the profile page and detracted from the overall experience. I addressed this by:

Frontend:

Tracking favorites in state and comparing new items before sending a POST request.

Displaying user feedback such as “Already added to favorites” when duplicates are detected.

Backend:

Updating the Mongoose schema to store yoga and meditation favorites as objects instead of plain strings.

Adding logic to prevent duplicates based on title or name before saving.

Improving the Profile Page
While reviewing the profile page, I realized that yoga poses and meditation sounds were only being displayed by name or title. This lacked depth and didn't communicate the value of the content. To improve this, I built a modal component that displays additional information when an item is clicked—such as the Sanskrit name, difficulty, benefits, and embedded media.

Final Technical Challenge: YouTube Embedding
One persistent issue throughout the project was rendering YouTube videos for meditation sounds or yoga demonstrations. Although embedding seemed simple, it took time to correctly extract the YouTube video ID and display it using an iframe. Once resolved, this made the UI significantly more engaging and informative.

Reflection and Key Takeaways
This project taught me the value of flexibility, persistence, and precision in full-stack development. While many of the challenges were technical, such as API failures or backend integration, some of the most important lessons were around process:

Always restart the server after changes—especially when working with routes or environment variables.

Naming consistency matters more than expected; even a small typo or singular/plural mismatch can break functionality.

Avoid assuming APIs will remain available or unchanged; be prepared to adapt.

Designing with the user in mind led me to make meaningful changes like personalized greetings, rich content modals, and clearer error messaging.

Overall, this project pushed me to improve my debugging skills, better structure my codebase, and think holistically about user experience and long-term maintainability.