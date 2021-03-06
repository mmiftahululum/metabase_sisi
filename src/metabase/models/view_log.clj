(ns metabase.models.view-log
  "The ViewLog is used to log an event where a given User views a given object such as a Table or Card (Question)."
  (:require [metabase.models.interface :as i]
            [metabase.util :as u]
            [toucan.models :as models]))

(models/defmodel ViewLog :view_log)

(defn- pre-insert [log-entry]
  (let [defaults {:timestamp :%now}]
    (merge defaults log-entry)))

(u/strict-extend (class ViewLog)
  models/IModel
  (merge models/IModelDefaults
         {:pre-insert pre-insert
          :types      (constantly {:metadata :json})})
  i/IObjectPermissions
  (merge i/IObjectPermissionsDefaults
         {:can-read?  (constantly true)
          :can-write? (constantly true)}))
