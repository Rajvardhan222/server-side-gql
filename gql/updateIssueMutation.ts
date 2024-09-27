import { gql } from 'urql'

export const EditIssueIssueMutation = gql`
  mutation EditIssue($input: editIssueInput!) {
    editIssue(input: $input) {
      createdAt
      id
      name
      status
    }
  }
`
