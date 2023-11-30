const prod = {
    env: 'production',
    api_host: ''
};

const testuser = {
    userName: "testUserName",
    identity: "user",
    userId: '61a953f957eb879278b8ad8b',
    eventId: '61ac693fe8e7fdea92743771'
}

const testManager = {
    userName: "testUserName",
    identity: "manager",
    userId: '61a9541c57eb879278b8ad94',
    eventId: '61ac693fe8e7fdea92743771'
}

const testAdmin = {
    userName: "testUserName",
    identity: "admin",
    userId: '61a9544757eb879278b8ad97',
    img: {
        image_id: "vbjizvferz5h9pfzq8t1",
        image_url: "http://res.cloudinary.com/jameschens/image/upload/v1638684470/vbjizvferz5h9pfzq8t1.jpg",
        created_at: "Sun Dec 05 2021 01:07:57 GMT-0500 (北美东部标准时间)"
    },
    eventId: '61ac693fe8e7fdea92743771'
}

const dev = {
    env: 'development',
    api_host: 'http://localhost:3001', 
    use_frontend_test_user: true, 
    user: testManager
};

export default process.env.NODE_ENV === 'production' ? prod : dev;