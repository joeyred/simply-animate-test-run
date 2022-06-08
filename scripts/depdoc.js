/**
 * Dependency Docs
 * 
 * Script for generating a readme for dependecies. 
 * 
 * The Goal:
 * 
 * To take the current dependecies in package.json and generate
 * a markdown file with each dependency listed, with their descriptions,
 * and a section allowing documenting why it was added, and what it's
 * being used for.
 * 
 * Possible Features: 
 * - showing where the dependecy is being used in the project.
 * 
 * Ideas for execution:
 * 
 * - Generate a yaml file of the dependecies to add descriptions to. This could 
 *   then be used with the file generation
 * 
 * - CLI wrapper with a description(whyInUse) option? Maybe have a wrapper script that calls the package
 *   manager to add things accordingly, but with the ability to add a description as well. 
 *   (The problem being it would be super hard to install multiple packages at once)
 */

// import pkgjson
const pkg = require('./package.json')

// check if node_modules is installed, if not, exit and give a message

// check for "whyInUse" yaml file

// check for a cache file (this file should have any descriptions, tags, and 
// version associated with the packages, that way they dont have to be fetched every time)

// FUNCTION
function parseDepsToObject(depsObj) {
  let output = {}
  for (key in depsObj) {
    output[key] = {

    }
  }
}
// loop over packages
//
// // check if package has been cached
// // // if cached
// // // // check if versions match
// // // // // if matching 
// // // // // // - check for description in cache ? use description : get description (go into node_modules)
// // // // // // - repeat for any other required fields from the pkg
// // // else
// // // // get all fields from package in node_modules
//
// // check if entry exists for package in `whyInUse`
// // // if exists
// // // // add fields
// // // else
// // // // add package to `whyInUse` object for future output
//
// // generate the markdown/html (depending on desired output)
// // append to array/string that represends file contents for the documentation
// 
// // update cache entry?

// sort `whyInUse` keys (keys should be the package names) into Alphabetical order

// output `whyInUse` as a yaml file

// output cache file 

// output final docs to be committed in repository
