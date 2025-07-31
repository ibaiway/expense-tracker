export const getSessionToken = (response: any) => {
  const cookie = response.headers["set-cookie"]
  const sessionToken = cookie?.find((c) =>
    c.startsWith("better-auth.session_token=")
  )
  if (!sessionToken) {
    return null
  }
  return sessionToken.split("=")[1]?.split(";")[0]
}
