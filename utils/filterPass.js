function filterPass (userToFilter) {
  if (!userToFilter._doc) return null

  const userData = Object.fromEntries(
    Object.entries(userToFilter._doc).filter(
      ([key, value]) => key !== 'password'
    )
  )

  return userData
}

export default filterPass
