# team 19 - CSC309 Group Project README - Phase 2

Forked from: https://github.com/csc309-fall-2021/team19 \
Contributors: Shaohong Chen, Dechen Han, Jinyang Zhao, You Peng \
The weblink may be expired due to the Heroku maintenance cost, please check the picture for reference: Display.jpeg

## Online Deployment
The online deployment is available on heroku
[https://event-show-team19.herokuapp.com/](https://event-show-team19.herokuapp.com/)

## Start the environment

To start the environment we need to set up first.
Under Explore_Booking, run:

```
npm setup
```

to install the dependencies of both client and server,
or use 

```
npm install
cd client
npm install
```

to install dependencies respectively.

To run the app in build mode, run
```
npm run build-run
```
Local deployment on [http://localhost:3001](http://localhost:3001)

To run the app in deployment, run 
```
npm start
```
in both folders client and Explore_Booking
Local deployment will be on [http://localhost:3000](http://localhost:3000) for synchronized development.

### `login credentials`
- Visitor: \
username: user\
password: user 
- Manager: \
username: user2\
password: user
- Admin: \
username: admin\
password: admin

## Phase 2 Modifications
- The first page is now choose event page, instead of login page
- the home page puts top three block onto the right part of the banner image, instead of listing them on the bottom.
- Adding general instruction at the bottom of homepage to make it clear for users to know what to do next.
- Instead of a link to go home, the prompt on top left now directs user to change the event, and when the user is logged in, there is a separate home button that allows users to go to corresponding homepage.
- In explore page, users are not able to quick book now, as it is hard to define what is "quick book". TO make it clear for users, they need to go into the booth page to book.
- Users now will be set with no avatar, or picture for now, but all types of users can upload a picture to be their file picture.
- Instead of admin choosing which event to show, now users can choose the events.
- The booking system now has a waitlist available, that when the availability of a booth is 0, the next ones to book it will be in the waitlist. As another user cancels the appointment, the first user in the waitlist will be taken into the book list, if any. If not, the availability simply adds one.

## Testing Steps
- Pick a way above to start the testing environment
- The default page is the choose event page, when user is not logged in, some of the movements are restricted. 
- Press the sign in button on choose event page, or press the sign in button to get to the login page, use one of the creadential to login
- Users and managers may explore the booth from home, Admins will be directed to personal profile page first. Then they can choose a event from choose event page by clicking the "More Events" on left top corner. 
- By pressing "REGISTER" button on the login page, it will switch to register page. You can fill in some personal information here and choose the account type. When you press "REGISTER" button, you will jump back to the login page to login if the credentials are valid.

### Visit as user
- Login using user/user
- HomePage, click explore, or click one of the top 3 booth blocks to visit booth pages
- Header. My Appointment Dropdown will show all current appointments. Click the avatar will lead to personal profile page
- Booth View, user can click book to book an appointment on desired time, while they can also cancel appointment there.
- For the appointments, if there are already more than available people booked for one time slot, press booking will make the user into waitlist. By the time another user cancels appointment, the user will be able to get into the waitlist automatically. \
The point above can be tested out using the 1 vs 1 booth in star wars park, with additional user user4/user and user5/user
- To comment, write in the text box and click submit. 
- As users can be deleted by admin, their comments will be shown but with a name "Deleted Users"
- In personal profile, click edit to edit personal info.

### As Manager
- Login using user2/user
- HomePage the same, except they don't have the appointment dropdown
- The booth detail will be the same as user's view, without booking function(timeslots shown in the same way as admin's view of booth detail page).
- In booth detail, manager can delete and add time slots. They are not able to delete comments to make sure the comments are reflecting truth.
- In personal profile, they can add new booth, or edit information of their current booth. The buttons for edit links to edit page of the corresponding booth names.

### As Admin
- Login using admin/admin
- After login, admin will be directed to profile page, so that they can directly add events when there's no event.
- Admins can click new event button to create exhibition, or event by filling a form. They can also edit the current event, or can manage users by clicking the button and go to user management page.
- In Booth detail, admin will be able to delete comments to maintain a peaceful and safe online environment
- Homepage, explore page, header are similar to manager


## Views and Features

#### Home and layout
- The homepage looks the same.
- Header in overall layout will show current appointment for users, displaying user name(upper) and identity(lower) for all users on top right
- Top left will be a slogan showing which event it is, it is also a link to homepage.

#### Explore page
- Booths are listed in grids in form of blocks with their brief. 
- Users will see a quick book button, while managers and admins cannot.

#### Booth Info page
- Users may comment to booths, and make appointments
- The manager will be able to modify the booth they are in charge in booths view. 
However, when they visit a booth that is not managed by him/her, the view will be the same as user.
Please refer to users booth view for reference.
- The administrator will be able to delete the comments for all booths
- All users can check other user's personal profile via clicking the avatar on the comments

#### Personal Profile
- All users can see and modify their personal profile in their corresponding pages
- Managers can see and go to the booth they manage.
- Admins can click the manage users button to manage all the users, deleting users or directly add users, skipping the process of register. Admin can only use 'admin', 'manager' or 'user' as user identity
- Admins can edit information of the current event or create a new one.\

#### Session API
GET /checkSession  \ 
"Check Session for the current user"  \
Send:{} \
Return: \
{
    "currentUser": {
        "userId": current user id,
        "userName": current username,
        "identity": current user type,
        "eventId":  current Event id
}

GET /setEventSession/:id  \
"Set Session for the current event with 'id'"  \
Send:{}  \
Return:{}  \

#### Event API
POST /api/editEvent/:id  \
"Edit the name, brief, description, and banner image for a given event"  \
Send:
{
    name: name of the event,
    brief: brief of the event,
    description: description of the event,
    files: the banner image of the event
} 


GET /api/getEvent/:id \
"Get the event object, the list of top three booth object in this event, and the list of all booths in this event" \
Return: \
{
    event: the event object, 
    top_three: the list of top three booths,
    all_booths: the list of all booths
} 


POST /api/createEvent \
"Create a new event object" \
Send: \
{
    name: name of the event,
    brief: brief of the event,
    description: description of the event,
    slogan: slogan of the event,
    img: the banner image of the event
} \
Return: \
{
    newExhibition: the new created event object
} 


#### User API
GET /user/search/:id \
"Search a user by the 'id'" \
Send: {} // Nothing. same below \
Return: \
{
    "userID": user ObjectId,  \ 
    "userName": username of user,  \
    "email": email of user,  \
    "identity": user type,  \
    "phone": phone of user,  \
    "image": user profile photo,  \
    "booths": if the identity is manager, list of booths she/he has,  \
    "reservations": if identity is user. list of reservation she/he has  \
}


Post /api/login \
"Log in and set current user information into the session" \
Send: \
{
    "username": username,
    "password": user password
} \
Return: \
{
    "userId": user ObjectId,
    "userName": username of user,
    "identity": user type,
    "eventId": current eventID in the seesion
}

GET /api/logout \ 
"Log out and clear the session" \
Send: {} \
Return: {}  \

POST /api/register \
"Register for a user" \
Send: \
{
    "fullname": new user's full name,
    "username": new user's username,
    "password": new user's password,
    "email": new user's email,
    "usertype": new user's user type,
} \
Return: \
{
    "id": new user's ObjectId
}

POST /api/editProfile/:id \
"Edit profile of a user with 'id'" \
Send: \
{
    "userName": new username,  \
    "email": new email,  \
    "phone": new phone number,  \
    "pic": new profile picture(according to demo of cloudinary usage in Mark's example) 
} \
Return: {}  \

GET /api/getAllUsers \
"Get all users' information" \
Send: {} \
Return: 
{
    [
        {
            "userId": user ObjectId,
            "userName": username,
            "identity": user type
        },
        ...
    ]
}   \

DELETE /api/deleteUser/:userid \
"Delete user with 'userid'" \
Send: {}  \ 
Return: {}  \

GET /api/getAppointments/:userid \
"Get all appointments(reservations) of a user with 'userid'" \
Send: {} \
Return:  \
{ 
    "currentAppointment": list of user reservations
}  \

POST /api/book/:booth_id/:user_id \
"User with 'user_id' books a reservation in the booth with 'booth_id'" \
Send:  \
{
    "timePeriod": reservation time
} \
Return: \
{
    "reservation": {
        "time": new reservation time,
        "boothName": new reservation booth name,
        "booth": new reservation booth id,
        "status": status of reservation('book' or 'waitlist')
    }
}
 
POST /api/cancelAppointment/:boothId/:userId \
"Cancel a certain appointment(reservation) of a user with 'userid' in the booth with 'booth_id'" \
Send:  \
{
    "time": canceled reservation time
} \
Return: {}  \

GET /api/getBoothAppointment/:boothid/:userid
"Get the specific appointment info for a user with 'userid' in the booth with 'boothid'"
Send: {}
Return: 
{
    "currentAppointment": one reservation or null if doesn't exist
}

#### Booth API

- GET /booth/search/:id \
"Get the booth with 'id'" \
send: {} \
Return: { \
    name: booth name, \
    eventid: eventid of this booth, \
    description: Description of this booth, \
    capacity: The capacity of this booth, \
    timeSlot: All timeSlot of this booth, \
    comments: All comments for this booth, \
    manager: the creator/manager of this booth, \
    img: booth banner image \
}

- POST /booth/edit/:id \
"Edit information of booth with 'id'" \
send:{ \
    name: new booth name, \
    description: new booth description \
    image: new booth image \
} \
Return:{} 

- POST /api/createBooth \
"create a new booth" \
send:{ \
    name: booth name, \
    intro: booth intro, \ 
    eventId: Eventid of this booth, \
    description: booth description, \
} \
Return:{ \
    booth: new booth \
}

- POST /api/addTimeSlot/:id \
"add a new time slot for booth with id 'id'" \
send:{ \
    time: time \
    capacity: total capacity \
}\
Return:{ \
    booth: updated booth,  \
    time_slot: new time slot \
}


- POST /api/removeTimeSlot/:id \
"add a new time slot for booth with id 'id'" \
send:{ \
    time: the time slot that need to remove  \
} \
Return:{ \
    booth: updated booth \
}


- POST /api/addComment/:id \
"add a new comment for booth with id 'id'" \
send:{ \
    user: userid, \
    comment: comment \
} \
Return: a list of comments, each in following form:{ \
    id: comment.id, \
    userName: .userName, \
    userIcon: userIcon, \
    comment: comment context \
}


- GET /api/allComments/:boothid \
"Get all comments for booth with id 'boothid'" \
send:{} \
Return: a list of comments, each in following form:{ \
    id: comment.id, \
    userName: .userName, \
    userIcon: userIcon, \
    comment: comment context \
}


- DELETE /api/deleteComment/:id/:com_id \
"Delete existing comment with id 'com_id' for booth with id 'id'" \
send:{} \
Return:{ \
    booth: updated booth \
}


### `Packages Used`
- Material-UI
- react-router-dom
- cloudinary
- connect-multiparty
