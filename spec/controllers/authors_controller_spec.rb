require 'rails_helper'

describe AuthorsController, :type => :controller do

  let(:user) do
    User.create!({
      :email => "ben@example.com"
    })
  end
  let(:user_2) do
    User.create!({
      :email => "christian@example.com"
    })
  end

  let(:author) { Author.create(first_name: 'cat', last_name: 'dog', owner_id: user.id) }
  let(:author_2) { Author.create(first_name: 'spot', last_name: 'dog', owner_id: user_2.id) }

  before(:all) do
    WebMock.disable!
    Timecop.freeze(Time.local(1990))
  end
  after(:all) do
    WebMock.enable!
    Timecop.return
  end
  before(:each) do
    # reset ES index, and make sure
    # testing authors are indexed.
    reset_index
    Author.put_mapping
    [author, author_2]
    ElasticMapper.index.refresh

    # fake :user being logged in
    controller.stub(:current_user).
      and_return(user)
  end

  describe "#index" do
    it "should return the list of authors" do
      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 2
      results['total'].should == 2
    end
  end

  describe "#show" do
    it "should return the author corresponding to the id" do
      get :show, id: author.id
      JSON.parse(response.body)['id'].should == author.id
    end

    it "should return a 404 if author not found" do
      get :show, id: -1
      response.status.should == 404
    end
  end

  describe "#create" do
    it "should return a 500 if first_name not provided" do
      post :create, { last_name: 'dog' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['first_name'].should == ["can't be blank"]
    end

    it "should allow an author to be created with first_name and last_name" do
      post :create, { first_name: 'rabbit', last_name: 'dog' }
      author = JSON.parse(response.body)
      author['first_name'].should == 'rabbit'

      # we should have already indexed author in ES,
      # and be able to grab it.
      get :index
      results = JSON.parse(response.body)

      results['documents'].count.should == 3
      results['total'].should == 3
    end

    it "should set the owner when creating an author" do
      post :create, { first_name: 'bunny', last_name: 'dog' }
      author = Author.find_by_first_name_and_last_name('bunny', 'dog')
      author.owner.should == user
    end
  end

  describe '#update' do
    it "should raise a 404 if author not found" do
      post :update, { id: -1 }
      response.status.should == 404
    end

    it "should allow the first_name to be changed" do
      post :update, { id: author.id, first_name: "my new first name" }
      author.reload
      author.first_name.should == 'my new first name'
    end

    it "should allow the last_name to be changed" do
      post :update, { id: author.id, last_name: "my new last name" }
      author.reload
      author.last_name.should == 'my new last name'
    end

    it "should raise a 401 if user tries to update an author they did not create" do
      post :update, { id: author_2.id, first_name: "scotty" }
      response.status.should == 401
      author_2.reload
      author_2.first_name.should == 'spot'
    end
  end

  describe "#destroy" do
    it "allows an author created by current_user to be destroyed" do
      delete :destroy, { id: author.id }
      response.status.should == 204

      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 1
      results['total'].should == 1
    end

    it "does not allow current_user to destroy another user's author" do
      delete :destroy, { id: author_2.id }
      response.status.should == 401

      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 2
      results['total'].should == 2
    end

    it "returns a 404 if author is not found" do
      delete :destroy, { id: -1 }
      response.status.should == 404
    end
  end
end
