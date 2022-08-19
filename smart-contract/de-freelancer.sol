// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract DeFreelancer{
    struct Project{
        address client;
        address freelancer;
        Statuses status;
        string title;
        string description;
        uint256 budget;
        uint256 minimumPayment;
        uint256 creationTimestamp;
        uint256 startedTimestamp;
        bool exists;
    }

    mapping(address => bool) public clients;
    mapping(address => bool) public freelancers;
    mapping(uint256 => Project) engagements;

    enum Statuses {ENGAGED, NOT_ENGAGED, ENDED, FREELANCER_FINISHED, CLIENT_APPROVED}

    uint256 public projectCounter;

    constructor(){
        projectCounter = 1;
    }

    modifier onlyClient() {
        require(clients[msg.sender] == true,"only registered clients can do this");
        _;
    }

    modifier onlyFreelancer() {
        require(freelancers[msg.sender] == true,"only registered freelancers can do this");
        _;
    }

    function registerUser(bool isClient, address addr) public {
        if(isClient){
            clients[addr] = true;
        }
        else{
            freelancers[addr] = true;
        }
    }

    function deregisterUser(bool isClient, address addr) public {
        if(isClient){
            clients[addr] = false;
        }
        else{
            freelancers[addr] = false;
        }
    }

    event ProjectCreateEvent(Project project);

    function initializeProject(
        string calldata projectTitle, 
        string calldata description, 
        uint256 budget, 
        uint256 minimumPayment
        ) public payable onlyClient{
        
        //create project and set fields
        Project storage project = engagements[projectCounter];
        project.client = msg.sender;
        project.title = projectTitle;
        project.description = description;
        project.status = Statuses.NOT_ENGAGED;
        project.budget = budget;
        project.minimumPayment = minimumPayment;
        project.creationTimestamp = block.timestamp;
        project.exists = true;

        engagements[projectCounter] = project;

        emit ProjectCreateEvent(project);
        
        projectCounter++; //every project must have unique id
    }

    function setFreelancerAndEngage(uint256 id, address freelancer) public onlyClient {
        //check if project exists
        require(engagements[id].exists, "wrong engagement id");
        //check if user owns this project
        Project memory project = engagements[id];
        require(project.client == msg.sender, "this user has no access to this contract");
        //check if freelancer is registered
        require(freelancers[freelancer], "freelancer is not registered");
        //check if status of project is "NOT_ENGAGED"
        require(project.status == Statuses.NOT_ENGAGED, "project can't be engaged: status must be NOT_ENGAGED");
        //make changes to the project
        engagements[id].freelancer = freelancer;
        engagements[id].status = Statuses.ENGAGED;
    }

    function endEngagement(uint256 id) public {
        
        Project memory project = engagements[id];

        require(project.exists, "wrong engagement id");
        
        address client = project.client;
        address freelancer = project.freelancer;

        require(project.status == Statuses.ENGAGED, "project can't be ended: status must be ENGAGED");
        
        if(msg.sender == client){
            //pay the freelancer minimumPayment
            makePayment(project.minimumPayment, freelancer);
            //return back rest of the budget to client
            makePayment(project.budget - project.minimumPayment, client);
            //end project
            engagements[id].status = Statuses.ENDED;
        } 
        if(msg.sender == freelancer)
        {
            //return all budget to client
            makePayment(project.budget, client);
            //end project
            engagements[id].status = Statuses.ENDED;
        } 
        else{
            revert ("this user has no access to this contract");
        }
    }

    function finishProject(uint256 id) public onlyFreelancer {
        //do all the procedural checks
        Project memory project = engagements[id];
        require(project.exists, "wrong engagement id");
        require(project.status == Statuses.ENGAGED, "project can't be finished: status must be ENGAGED");
        require(project.freelancer == msg.sender, "current user has no access to this project");

        //change the status of the project
        engagements[id].status = Statuses.FREELANCER_FINISHED;

    }

    function approveOrDisapproveProject(uint256 id, bool approved) public onlyClient {
        //do all the procedural checks
        Project memory project = engagements[id];
        require(project.exists, "wrong engagement id");
        require(project.status == Statuses.FREELANCER_FINISHED, "project can't be approved: status must be FREELANCER_FINISHED");
        require(project.client == msg.sender, "current user has no access to this project");

        //change the status of the project
        if(approved){
            engagements[id].status = Statuses.CLIENT_APPROVED;    
            //make full payment to freelancer
            makePayment(project.budget, engagements[id].freelancer);
            //make project ENDED as soon as payment goes to freelancer
            engagements[id].status = Statuses.ENDED;
        }
        else{
            //roll back to ENGAGED status if client does not accept finished work of freelancer
            engagements[id].status = Statuses.ENGAGED;
        }
    }

    function makePayment(uint256 amount, address receiver) private{
        (bool sent, ) = receiver.call{value: amount}("");
        require(sent, "Failed to send payment");
    }

}