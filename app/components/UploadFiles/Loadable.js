/**
 *
 * Asynchronously loads the component for UploadFiles
 *
 */

import loadable from "utils/loadable";

export default loadable(() => import("./index"));
