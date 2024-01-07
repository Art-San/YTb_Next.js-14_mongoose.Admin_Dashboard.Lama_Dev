import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { connectToDB } from './utils'
import { User } from './models'
import bcrypt from 'bcrypt'
// import Credentials from 'next-auth/providers/credentials'

const login = async (credentials) => {
  try {
    connectToDB()
    const user = await User.findOne({ username: credentials.username })

    // if (!user) throw new Error('Wrong credentials!')
    if (!user || !user.isAdmin) throw new Error('не user или не admin!')

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    )

    if (!isPasswordCorrect) throw new Error('Wrong credentials!')

    return user
  } catch (err) {
    console.log('auth login -- Failed to login!')
    throw new Error('Failed to login!')
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth
} = NextAuth({
  ...authConfig,
  providers: [
    // Credentials({
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials)
          // console.log('auth NextAuth ser', user) // есть user
          return user
        } catch (err) {
          console.log('auth CredentialsProvider err', err)
          return null
          // return err
        }
      }
    })
  ]
})

// https://authjs.dev/getting-started/providers/credentials-tutorial#:~:text=pages/api/auth/%5B...nextauth%5D.ts
// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         const authResponse = await fetch('/users/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(credentials)
//         })

//         if (!authResponse.ok) {
//           return null
//         }

//         const user = await authResponse.json()

//         return user
//       }
//     })
//   ]
// })
