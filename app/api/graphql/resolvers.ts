import { db } from '@/db/db'
import { InsertIssues, SelectIssues, issues, users } from '@/db/schema'
import { GQLContext } from '@/types'
import { getUserFromToken, signin, signup } from '@/utils/auth'
import { and, asc, desc, eq, or, sql } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const resolvers = {
  IssueStatus: {
    DONE: 'done',
    TODO: 'todo',
    INPROGRESS: 'inprogress',
    BACKLOG: 'backlog',
  },

  Query: {
    me: (_, __, ctx: GQLContext) => {
      return ctx.user
    },
    issues :async (_,{input},ctx:GQLContext) => {
        if (!ctx.user) {
            throw new GraphQLError('UNAUTHORIZED', {
              extensions: {
                code: 401,
              },
            })
          }

          const andFilter = [eq(issues.userId,ctx.user.id)]

          if(input && input.statuses){
            const statusFilters = input.statuses.map((status) => eq(issues.status,status))
          

          andFilter.push(or(...statusFilters))

          }

          const data = await db.query.issues.findMany({
            where: and(...andFilter),
            orderBy: [
              asc(sql`case ${issues.status}
            when "backlog" then 1
            when "inprogress" then 2
            when "done" then 3
          end`),
              desc(issues.createdAt),
            ],
          })
    
          return data

    }
  },
  Mutation: { //  parent,args,global context,info
    signin: async (_, { input } , ctx) => {
      const data = await signin(input)

      if (!data || !data.token || !data.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: {
            code: 401,
          },
        })
      }

      return { ...data.user, token: data.token }
    },
    createUser: async (_, { input }) => {
      const data = await signup(input)
      if (!data || !data.token || !data.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: {
            code: 401,
          },
        })
      }
      return { ...data.user, token: data.token }
    },

    createIssue: async (_, { input }, ctx: GQLContext) => {
      if (!ctx.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: {
            code: 401,
          },
        })
      }

      const data = await db
        .insert(issues)
        .values({
          userId: ctx.user.id,
          ...input,
        })
        .returning()
      return data[0]
    },

    editIssue : async(_,{input},ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: {
            code: 401,
          },
        })
      }

      const {id,...update} = input
      const result = await db.update(issues).set(update ?? {})
      .where(and(eq(issues.userId,ctx.user.id),eq(issues.id,id)))
      .returning()

      return result[0];



    }
  },
  Issue: {
    user: (issue, _, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: {
            code: 401,
          },
        })
      }

      return db.query.users.findFirst({
        where: eq(users.id, issue.userId),
      })
    },
  },
  User : {
    issues : (user,_,ctx) => {
      return db.query.issues.findMany({
        where : eq(issues.userId,user.id)
      })
    }
  }
}
