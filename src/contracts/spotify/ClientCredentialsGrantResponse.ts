/**
 * Response returned when using Client Credentials authentication flow
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#example-4
 */
export interface ClientCredentialsGrantResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}