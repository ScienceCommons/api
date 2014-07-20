PaperSearchApi::Application.routes.draw do
  devise_for :users, :controllers => { :sessions => "sessions" }
  devise_scope :user do
    resources :sessions, :only => [:create, :destroy]
    match '/sessions/user', to: 'devise/sessions#create', via: :post
  end
  resources :users, :only => [:index, :show]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'alpha#index'
  get '/bem.html' => 'alpha#bem'
  get '/barghetal.html' => 'alpha#barghetal'
  get '/matzkeetal.html' => 'alpha#matzkeetal'
  get '/donnellanetal.html' => 'alpha#donnellanetal'
  get '/arielyetal.html' => 'alpha#arielyetal'
  get '/zhongetal.html' => 'alpha#zhongetal'
  get '/tversky_kahneman.html' => 'alpha#tversky_kahneman'
  get '/husnu_crisp.html' => 'alpha#husnu_crisp'
  get '/lebel_wilbur.html' => 'alpha#lebel_wilbur'
  get '/schnalletal.html' => 'alpha#schnalletal'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  resources :studies, :only => [:show, :update] do
    resources :replications, :only => [:show, :index]
    resources :replication_of, :only => [:show, :index]
    resources :findings, :only => [:show, :index]
    resources :materials, :only => [:show, :index]
    resources :registrations, :only => [:show, :index]
  end

  resources :articles do
    collection do
      get 'recent'
    end
    resources :studies do
      resources :replications
      resources :replication_of
      resources :findings
      resources :materials
      resources :registrations
    end
  end

  resources :sessions, :only => [:create, :destroy]

  # Our own OAuth provider.
  post 'oauth2/token', :to => proc { |env| TokenEndpoint.new.call(env) }
  #resource :session, :only => :new

  # Third-party OAuth providers.
  get "/auth/google_oauth2/callback" => "oauth_sessions#create"
  get "/login" => "oauth_sessions#login"

  get '/beta', to: 'beta#index'
end
