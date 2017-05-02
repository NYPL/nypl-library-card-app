const nyplIdentityPatronCookie = '{"token_type":"Bearer","scope":"openid+offline_access+patron:' +
'read","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lm55cGwu' +
'b3JnIiwic3ViIjoiNjM2NzAyOCIsImF1ZCI6ImFwcF9sb2dpbiIsImlhdCI6MTQ4MjE3NjQ3MCwiZXhwIjoxNDgyMTgwMDcw' +
'LCJhdXRoX3RpbWUiOjE0ODIxNzY0NzAsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIGNvb2tpZSBwYXRyb246cmVh' +
'ZCJ9.JO7VbOqCC7HyjRmeyHD4zM1Gl0JBk5RdxjAkCp0h6sfVe-xs5FyY7biYqs19k4dUY2DbFYR5IG3xYt9IdhqyMkSnJxt' +
'iCY36WN7X_e0eBF2T1_IWKGaBc4JlbroMj5_aNB5W4nQvclrdlb2mV38Q_HGAMUKe8DDeCmAHctEtqGppNl8DC7IvqkekRS_' +
'6zgQwsHHW5kJR-f7zUROi4fvFpdNR-I7J4VNWdFIOijb4vXFOOWRLzdY_GHLJdWvSgxhqzwkceA5BScCicAKeHYHo04vabNp' +
'5TvPXoR0ypULqTyGYsNnXnUmh2Mu46j3bcNTACEKS97FBx1IfwttBL1ARtQ","refresh_token":"0478cafb40da0341c9' +
'7c5f5a1866696157d2ebcc","expires":1493749554}';

const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwc' +
  'zpcL1wvd3d3Lm55cGwub3JnIiwic3ViIjoiNjM2NzAyOCIsImF1ZCI6ImFwcF9sb2dpbiIsImlhdCI6MTQ4MjE3NjQ3MC' +
  'wiZXhwIjoxNDgyMTgwMDcwLCJhdXRoX3RpbWUiOjE0ODIxNzY0NzAsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXN' +
  'zIGNvb2tpZSBwYXRyb246cmVhZCJ9.JO7VbOqCC7HyjRmeyHD4zM1Gl0JBk5RdxjAkCp0h6sfVe-xs5FyY7biYqs19k4d' +
  'UY2DbFYR5IG3xYt9IdhqyMkSnJxtiCY36WN7X_e0eBF2T1_IWKGaBc4JlbroMj5_aNB5W4nQvclrdlb2mV38Q_HGAMUKe' +
  '8DDeCmAHctEtqGppNl8DC7IvqkekRS_6zgQwsHHW5kJR-f7zUROi4fvFpdNR-I7J4VNWdFIOijb4vXFOOWRLzdY_GHLJd' +
  'WvSgxhqzwkceA5BScCicAKeHYHo04vabNp5TvPXoR0ypULqTyGYsNnXnUmh2Mu46j3bcNTACEKS97FBx1IfwttBL1ARtQ';

const barcodeSrc = {
  src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAAAyCAIAAADN+56HAAAAsklEQVR4nO3ROwrDMB' +
  'QAwYfvf+e4M8EfFSakWGYKYSFZCO18lmbmGL+np4/Tzj+s3t7ter3bE55+fzrtxep6z29fZmEbutQtU7dM3TJ1y9QtU7dM' +
  '3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y9QtU7' +
  'dM3TJ1y9QtU7dM3TJ1y9QtU7dM3TJ1y3b6Ggpn/P9O6AAAAABJRU5ErkJggg==',
};

export default {
  nyplIdentityPatronCookie,
  accessToken,
  barcodeSrc,
}
