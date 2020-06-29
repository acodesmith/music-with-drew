module.exports = {
  siteMetadata: {
    title: 'Music With Me!',
		siteUrl: `https://musicwith.me`,
		description: `Search and share list of musical performances.`,
  },
  plugins: [
		`gatsby-plugin-postcss`,
    'gatsby-plugin-react-helmet',
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `data`,
				path: `${__dirname}/src/data/`,
			},
		},
		`gatsby-transformer-csv`,
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				// The property ID; the tracking code won't be generated without it
				trackingId: "UA-171047062-1",
				// Defines where to place the tracking script - `true` in the head and `false` in the body
				head: false,
				// Setting this parameter is optional
				anonymize: true,
				// Setting this parameter is also optional
				respectDNT: true,
				cookieDomain: "musicwith.me",
			},
		},
  ],
}
