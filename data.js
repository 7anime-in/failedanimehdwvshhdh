// Dynamic Anime Database with Seasons & Streaming Sources
const ANIME_DATABASE = [
    {
        id: "1",
        title: "Classroom of the Elite (Hindi Dub)",
        type: "TV Series",
        rating: "8.8",
        rank: 1,
        genres: ["Psychological", "Drama", "School"],
        episode: "43 Episodes (4 Seasons)",
        description: "Ayanokoji Kiyotaka enters the prestigious Advanced Nurturing High School, where students enjoy freedom, but only the elite receive favorable treatment. Watch Season 1 to 4 in Hindi Dub.",
        image: "https://lh3.googleusercontent.com/d/1J0za-zSCfOStt-bs8dzV7j4YlmVBOHuF",
        progress: 0,
        seasons: [
            {
                seasonId: "s1",
                seasonName: "Season 1",
                episodes: [
                    { episodeId: "ep1", episodeNumber: 1, title: "EP 1", videoUrl: "https://drive.google.com/file/d/1mLI2Q7uNC23G1rilqnzmW2dz52pg_aVC/preview" },
                    { episodeId: "ep2", episodeNumber: 2, title: "EP 2", videoUrl: "https://drive.google.com/file/d/1Iu2jSuKeh8lr4ycHR3RjtNmprYY1iR7y/preview" },
                    { episodeId: "ep3", episodeNumber: 3, title: "EP 3", videoUrl: "https://drive.google.com/file/d/1Ou_et2AxJzVw1fstL1nMC65Fg4SCCyfm/preview" },
                    { episodeId: "ep4", episodeNumber: 4, title: "EP 4", videoUrl: "https://drive.google.com/file/d/1l8dencMDEKZNdhibV7LW5EbI_XPevYQN/preview" },
                    { episodeId: "ep5", episodeNumber: 5, title: "EP 5", videoUrl: "https://drive.google.com/file/d/1HLdSusLSRE1w9w_Nr83J_Wy1UbTm-GZC/preview" },
                    { episodeId: "ep6", episodeNumber: 6, title: "EP 6", videoUrl: "https://drive.google.com/file/d/1TOWhCDdoPVM7dfFAj0A3mvU59F2TPUtm/preview" },
                    { episodeId: "ep7", episodeNumber: 7, title: "EP 7", videoUrl: "https://drive.google.com/file/d/1nklAu7VLVNOfjdTzM98hTDpAy5QpZ-Ql/preview" },
                    { episodeId: "ep8", episodeNumber: 8, title: "EP 8", videoUrl: "https://drive.google.com/file/d/1lRlzPbF-Mqx3-_lYdZD04z7yE2AFXB8V/preview" },
                    { episodeId: "ep9", episodeNumber: 9, title: "EP 9", videoUrl: "https://drive.google.com/file/d/1tXne5olJsLqONQUP24otk4rZrR8T5J0i/preview" },
                    { episodeId: "ep10", episodeNumber: 10, title: "EP 10", videoUrl: "https://drive.google.com/file/d/1EN6TSfugSv6-heJJ0nyqUJiNRbd7dqwl/preview" },
                    { episodeId: "ep11", episodeNumber: 11, title: "EP 11", videoUrl: "https://drive.google.com/file/d/1-BaYW3EQbqzEUS3WtSIk9GPvrdJKMhpT/preview" },
                    { episodeId: "ep12", episodeNumber: 12, title: "EP 12", videoUrl: "https://drive.google.com/file/d/11nurJGCkyRAt_FJutVi3y6J8VxTtgi5C/preview" }
                ]
            },
            {
                seasonId: "s2",
                seasonName: "Season 2",
                episodes: [
                    { episodeId: "ep1", episodeNumber: 1, title: "EP 1", videoUrl: "https://drive.google.com/file/d/1Qj6JN7GSLuoYct4ovWPRxAo1269Bjr7F/preview" },
                    { episodeId: "ep2", episodeNumber: 2, title: "EP 2", videoUrl: "https://drive.google.com/file/d/1wSX4GCGDv7J4uUay8LS8q7xyjXSD1HQ0/preview" },
                    { episodeId: "ep3", episodeNumber: 3, title: "EP 3", videoUrl: "https://drive.google.com/file/d/1DwjAKhLfQfT-1RqRJIXUIljfpipygCao/preview" },
                    { episodeId: "ep4", episodeNumber: 4, title: "EP 4", videoUrl: "https://drive.google.com/file/d/1ltx8ZBaTpyikGIGdRB2gsdjqxpAnyMeK/preview" },
                    { episodeId: "ep5", episodeNumber: 5, title: "EP 5", videoUrl: "https://drive.google.com/file/d/1LsWRx6yfsT43pcfRdB213fGLbQfjeP6l/preview" },
                    { episodeId: "ep6", episodeNumber: 6, title: "EP 6", videoUrl: "https://drive.google.com/file/d/1PbhPDRCFtf30P6Zd0IrmOEqO4JQ_OQdI/preview" },
                    { episodeId: "ep7", episodeNumber: 7, title: "EP 7", videoUrl: "https://drive.google.com/file/d/1ibaRZ1drKDW-DaPsPPslz1r1mWEdymc4/preview" },
                    { episodeId: "ep8", episodeNumber: 8, title: "EP 8", videoUrl: "https://drive.google.com/file/d/1ibaRZ1drKDW-DaPsPPslz1r1mWEdymc4/preview" },
                    { episodeId: "ep9", episodeNumber: 9, title: "EP 9", videoUrl: "https://drive.google.com/file/d/1CF9QBKPE9KLVFLkiTBv_evwvjzfek7pd/preview" },
                    { episodeId: "ep10", episodeNumber: 10, title: "EP 10", videoUrl: "https://drive.google.com/file/d/1soaLkGvoyMo4YNEBoqlujGx-21PnFc9A/preview" },
                    { episodeId: "ep11", episodeNumber: 11, title: "EP 11", videoUrl: "https://drive.google.com/file/d/10F2QXfOWNK2tnZiZOgExUe3MfXbb_L7S/preview" },
                    { episodeId: "ep12", episodeNumber: 12, title: "EP 12", videoUrl: "https://drive.google.com/file/d/1HQcD7kYNFh8pzs3LmBEOpykIdaD8VCgX/preview" },
                    { episodeId: "ep13", episodeNumber: 13, title: "EP 13", videoUrl: "https://drive.google.com/file/d/1fm-zIXOHYzZJN-AwqKPI3UvTDLrNW7Sj/preview" }
                ]
            },
            {
                seasonId: "s3",
                seasonName: "Season 3",
                episodes: [
                    { episodeId: "ep1", episodeNumber: 1, title: "EP 1", videoUrl: "https://drive.google.com/file/d/1US6jJ0OTkfEDLQgPP4UcbtJnu0mJdmP6/preview" },
                    { episodeId: "ep2", episodeNumber: 2, title: "EP 2", videoUrl: "https://drive.google.com/file/d/1EASbEA4Cgr9ci61fZyIQmkZpK66ST2dO/preview" },
                    { episodeId: "ep3", episodeNumber: 3, title: "EP 3", videoUrl: "https://drive.google.com/file/d/1et_Hurl7KlW6vj2cQffiZa90M23r9lvv/preview" },
                    { episodeId: "ep4", episodeNumber: 4, title: "EP 4", videoUrl: "https://drive.google.com/file/d/1PT877Uu-hUPNy9ZF9rnqJOV6T6IcSAH7/preview" },
                    { episodeId: "ep5", episodeNumber: 5, title: "EP 5", videoUrl: "https://drive.google.com/file/d/1B1HL09ImQWI1YqgdDivJRlflEc1LqCKG/preview" },
                    { episodeId: "ep6", episodeNumber: 6, title: "EP 6", videoUrl: "https://drive.google.com/file/d/1J0VIIhCE6zxYMGd23jpMw7gwpKqnpeMS/preview" },
                    { episodeId: "ep7", episodeNumber: 7, title: "EP 7", videoUrl: "https://drive.google.com/file/d/196Z3ogkBTAd42ZmWq0TuoIe7QUzwKNwl/preview" },
                    { episodeId: "ep8", episodeNumber: 8, title: "EP 8", videoUrl: "https://drive.google.com/file/d/1NckDO2dEbOUE2NggyZUcpjqgjqLxDSps/preview" },
                    { episodeId: "ep9", episodeNumber: 9, title: "EP 9", videoUrl: "https://drive.google.com/file/d/1nBGNW6AQzPCO_OMoBAIYjGCIn5ewCvFb/preview" },
                    { episodeId: "ep10", episodeNumber: 10, title: "EP 10", videoUrl: "https://drive.google.com/file/d/1O_aMc-OHSv0HKCJ2dh-8PFivlItoDBWQ/preview" },
                    { episodeId: "ep11", episodeNumber: 11, title: "EP 11", videoUrl: "https://drive.google.com/file/d/1YgtWvkY2NbivG84wnpga_LT87xvngb5_/preview" },
                    { episodeId: "ep12", episodeNumber: 12, title: "EP 12", videoUrl: "https://drive.google.com/file/d/1ps4Vp8tQy55lb4OgWnUuvsYTEwRHr5po/preview" },
                    { episodeId: "ep13", episodeNumber: 13, title: "EP 13", videoUrl: "https://drive.google.com/file/d/1etKY6GNC0ZmqXedsT7bO4YWRs8u5snkv/preview" }
                ]
            },
            {
                seasonId: "s4",
                seasonName: "Season 4",
                episodes: [
                    { episodeId: "ep1", episodeNumber: 1, title: "EP 1", videoUrl: "https://drive.google.com/file/d/1JGQZsEsnV3rCxol4scspTZkT7SS88n98/preview" },
                    { episodeId: "ep2", episodeNumber: 2, title: "EP 2", videoUrl: "https://drive.google.com/file/d/19cNfNi9riQkpNi5vaJPHE0yg1dt6eeJi/preview" },
                    { episodeId: "ep3", episodeNumber: 3, title: "EP 3", videoUrl: "https://drive.google.com/file/d/1xXfYn7hp-t9c0UPfGZTQaCAnfty10FR1/preview" },
                    { episodeId: "ep4", episodeNumber: 4, title: "EP 4", videoUrl: "https://drive.google.com/file/d/15LUE5Al2covTuEkWSXcIHYF9QqVhH8Ne/preview" },
                    { episodeId: "ep5", episodeNumber: 5, title: "EP 5", videoUrl: "https://myvidplay.com/e/j1lu0r3vtv01" }
                ]
            }
        ]
    }
];

const GENRES_LIST = [
    { name: "Psychological", count: "1 Title" },
    { name: "Drama", count: "1 Title" },
    { name: "School", count: "1 Title" },
    { name: "Action", count: "0 Titles" }
];
