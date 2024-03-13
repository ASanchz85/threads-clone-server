import mongoose from 'mongoose'

async function dbConnection () {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected successfully', connect.connection.host)
  } catch (error) {
    console.log('Database connection failed', error)
    process.exit(1)
  }
}

export default dbConnection
