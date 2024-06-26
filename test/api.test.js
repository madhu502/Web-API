//import request from supertest
const request = require("supertest");

//importing server file
const app = require("../index");

//token test
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzdhNGQwZjgwNjhjYzgzMDlhODAxMyIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkxMTcwMzN9.CScmr-loo3Q2KDBIAxiaCp_XGtpyncuD1_oIYY2YzR0"


//describe (List of test cases)
describe("Testing API", () => {
  //testing '/test' api
  it("GET /test | Response with text", async () => {
    //send request
    const response = await request(app).get("/test");

    //if its successful, status code
    expect(response.statusCode).toBe(200);

    //compare received text
    expect(response.text).toEqual("Test api is working..");
  });

  //get all products
  it('GET Products | Fetch all Products', async () => {
    const response = await request(app).get('/api/product/get_all_products').set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Product fetched successfully');
})


  //Registration testing
  //1. sending request (with data)
  //2. except :201
  //3. if already exist : handle accordingly
  //4. success
  it('POST /api/user/create | Response with body', async ()=>{
    const response= await request(app).post('/api/user/create').send({
        "firstName":"John",
        "lastName":"Shah",
        "email":"john@gmail.com",
        "password":"123456"

    })

    //if condition
    if(!response.body.success){
        expect(response.body.message).toEqual('User Already Exists!')
    }else{
        expect(response.body.message).toEqual('User created successfully')
    }
  });

  //Login
  //login with 
  //except :token(length)
  //except :userData
  //except: userData.firstName == John
  //except : Incorrect password
  
  it('POST /api/user/login | Response with Body', async () => {
    const response = await request(app).post('/api/user/login').send({
        "email": "viuo@gmail.com",
        "password": "1234567890"
    })
    // Check for token existence and length
    expect(response.body.token.length).toBeGreaterThan(0);

    // Check for user data
    expect(response.body.userData.firstname).toEqual("tappu");

    // Check for successful message
    expect(response.body.message).toEqual("user logined successfull");
  })

});


