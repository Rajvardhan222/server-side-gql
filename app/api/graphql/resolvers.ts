const resolvers = {
  SearchType: {
    __resolveType: (obj) => {
    //   console.log(obj)
      if (obj.species) {
        return 'Animal'
      }

      return 'Person'
    },
  },
  Person: {
    name: (person) => {
        console.log(person)
      return 22
    },
  },
  Query: {
    search: () => {
      return [
        {
          name: 'this is a name',
          id: 'huw',
        },
        {
          name: 'any',
          species: 'Big cat',
        },
      ]
    },
    me: () => {
      return 'me'
    },
    people: () => {
      return [{ name: 'hitesh', id: 'njkwsd' }]
    },
  },
}

export default resolvers
