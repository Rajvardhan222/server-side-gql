export const schema = `#graphql

type Issue {
    id : ID!
    name : String!
    content : String!
    userId : ID!
    projectId : ID
    status : IssueStatus
    user : User!
}

input CreateIssueInput{
    name : String!
    content : String!
    status : IssueStatus
}

enum IssueStatus {
    DONE
    TODO
    INPROGRESS
    BACKLOG
}

type User {
    id : ID!
    email :String!
    createdAt : String!
    token : String!
    issues : [Issue]!
}

input AuthInput {
    email:String!
    password : String!
}

input IssueFilterInput {
    statuses : [IssueStatus!]!
}

type Query{
    me:User!
    issues (input:IssueFilterInput) : [Issue]!
}

type Mutation {
    signin(input : AuthInput!) : User
    signup(input : AuthInput!) : User
    createIssue(input : CreateIssueInput!) : Issue!

}
`