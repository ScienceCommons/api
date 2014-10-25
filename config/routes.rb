PaperSearchApi::Application.routes.draw do
  match '*all', to: 'application#set_headers', via: [:options]

  resources :users, :only => [:index, :show, :create, :update] do
    member do
      post 'toggle_admin'
    end

    collection do
      get 'admins'
      get 'beta_mail_list'
    end
  end

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
  resources :studies, :only => [:index, :show, :update] do
    resources :replications
    resources :replication_of
    resources :findings
    resources :materials
    resources :registrations
  end

  resources :comments, :only => [:show, :destroy]
  get ":commentable_type/:commentable_id/comments(/:field)" => "comments#index"
  post ":commentable_type/:commentable_id/comments(/:field)" => "comments#create"

  resources :materials
  resources :replications
  resources :registrations
  resources :findings
  resources :invites, :only => [:create]
  resources :authors, :only => [:index, :show, :create, :update, :destroy]

  resources :articles do
    collection do
      get 'recent'
      get 'recently_added'
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
  # used for unit testing our OAuth controller before it's in use.
  resources :oauth_protected
  #resource :session, :only => :new

  # Third-party OAuth providers.
  get "/auth/google_oauth2/callback" => "oauth_sessions#create"
  get "/login" => "oauth_sessions#login"
  get "/log_out" => "oauth_sessions#destroy"

  get '/beta', to: 'beta#index'
  get '/beta/*all', to: 'beta#index'
end
