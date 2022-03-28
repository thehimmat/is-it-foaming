# Is It Foaming?

## Intro
> An application for bioscientists to view images of reactors and mark them as foaming or not foaming

## Example
| Not Foaming | Foaming |
|---|---|
|<img src="https://take-home-foam-challenge.s3.us-west-2.amazonaws.com/prod-exp13436-2020-01-08-at-04.24.38-9zijoye9dteugy6agooo506u3c6wrin920a99mavvv4z9mahkt7qbu6thl2l3v39.png" alt="not foaming" width="300" />|<img src="https://take-home-foam-challenge.s3.us-west-2.amazonaws.com/prod-exp13436-2020-01-09-at-01.12.12-h0xqqahhsie7syl8zzfpkwjp51y5fgit4ip2vn0w9g3ifqssqdps5ekkahc9w31j.png" alt="foaming" width="300" />|

> Buttons below each image will allow the user to tag each image as foaming or not foaming

## User Experience
> The user can:
> 1. view images of reactors
> 2. tag images as foaming or not
> 3. tags are stored in database for persistence
> 4. filter images by:
>    - foaming, not foaming, unclassified or no filter

## Tech Stack
> * React
> * create-react-app
> * Express
> * Node
> * dayjs
> * Axios
> * PostgreSQL

## Local Setup
> 1. `git clone git@github.com:thehimmat/is-it-foaming.git`
> 2. `npm install && cd isItFoaming npm install`
> 3. `npm start`

### Known Bug
> When viewing images by the "unclassified" filter, images aren't immediately removed and marked. The bandaid solution was to force the filter to change to whatever the image was tagged as. Those images still stay in the unclassified filter view until refresh.
## Creator
> Himmat Khalsa
> * [GitHub](github.com/thehimmat)