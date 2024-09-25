const schema = `#graphql
type Person {
    name : String!,
    id : ID
}

type Animal {
    species : String!
    name : String!
} 

union SearchType = Person | Animal


   type Query{
        me:String!
        people : [Person!]!
        search :SearchType! 
    }
`

export default schema
