import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../wayfinder'

/**
* @see \App\Http\Controllers\ArtistReportController::report
 * @see app/Http/Controllers/ArtistReportController.php:140
 * @route '/client/artists/{artist}/report'
 */
export const report = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/client/artists/{artist}/report',
} satisfies RouteDefinition<["post"]>

report.url = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artist: args }
    }

    if (Array.isArray(args)) {
        args = {
                    artist: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artist: args.artist,
                }

    return report.definition.url
            .replace('{artist}', parsedArgs.artist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

const ArtistReportController = { report }

export default ArtistReportController
