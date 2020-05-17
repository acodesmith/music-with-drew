module.exports = {
  siteMetadata: {
    title: 'Music With Drew!',
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
  ],
}
