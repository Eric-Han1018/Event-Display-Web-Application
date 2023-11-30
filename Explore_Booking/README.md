# CSC309 Group Project README


## Start the environment

### `npm start`

Runs the app in the development mode.\
Local develop on [http://localhost:3000](http://localhost:3000)

### `login credentials`
- Visitor: 
username user
password: user 
- Manager: 
username user2
password: user2
- Admin: 
username admin
password: admin

## Testing Steps
- Run npm start
- The default page is the login page, use one of the creadential to login
- Users and managers may explore the booth from home, Admins will be directed to personal profile page first. 
To start from home, click on the slogan on top left corner of page.
- By pressing "REGISTER" button on the login page, it will switch to register page. You can fill in some personal information here and choose the account type. When you press "REGISTER" button, you will jump back to the login page.

### As user
- Login using user/user
- HomePage, click explore, or click one of the top 3 booth blocks to visit sample booth page
- Explore page includes all available booths. Click the quick book button to make an appointment on the next available time slot.
- Header. My Appointment Dropdown will show all current appointments. Click the avatar will lead to personal profile page
- Booth View, user can click book to book an appointment on desired time, while they can also cancel appointment there.
To comment, slide to the bottom, write in the text box and click submit. 
- In personal profile, click edit to edit personal info.

### As Manager
- Login using user2/user2
- HomePage the same
- In explore, currently we set all links on the booth blocks to the view of booth managed by this manager.
- In booth detail, manager can delete a time slot or edit booth info. They are not able to delete comments to make sure the comments are reflecting truth.
- In personal profile, they can add new booth besides editing information

### As Admin
- Login using admin/admin
- The main difference is in profilePage. Admins can click new exhibition to create new exhibition by filling a form,
edit the current exhibition, or can manage users by clicking the button and go to user management page.
- In Booth detail, admin will be able to delete comments to maintain a peaceful and safe online environment
- Homepage, explore page, header are similar to manager


## Views and Features

#### Home and layout
- The homepage looks the same.
- Header in overall layout will show current appointment for users only, 
while displaying user name and identity for all users on top right

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
- Admins can link to manage all the users, and can edit information of exhibition or create a new one.

### `References`
- Star Wars Login Logo: https://logos.fandom.com/wiki/Star_Wars

### `Packages Used`
- Material-UI
- react-router-dom

