Myapp::Application.routes.draw do

  # You can have the root of your site routed with "root"
  root to: 'dashboards#dashboard_4'

  resources :salad
  # All routes
  get "layoutsoptions/index"
  get "layoutsoptions/off_canvas"

end
