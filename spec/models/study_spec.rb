require 'spec_helper'

describe Study do

  # creating an article indexes
  # the article in ES which causes
  # problems for WebMock.
  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  let(:article) do
    Article.create(
      title: 'Z Article',
      doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
      publication_date: Time.now - 3.days,
      abstract: 'hello world'
    )
  end
  let(:study) do
    Study.create({
        article_id: article.id,
        n: 0,
        power: 0
    })
  end

  describe "create" do

    it "should not allow study to be created without article_id" do
      study = Study.create({
          n: 0,
          power: 0
      })

      study.errors.count.should == 1
      field, error = study.errors.first
      field.should == :article_id
      error.should == "can't be blank"
    end

    it "should initialize variables as an array" do
      study.dependent_variables.kind_of?(Array).should == true
      study.independent_variables.kind_of?(Array).should == true
    end

    it "should initialize effect_size with an empty hash" do
      study.effect_size.kind_of?(Hash).should == true
    end
  end

  describe "add variables" do
    it "should persist dependent variables that are added" do
      study.add_dependent_variables('reaction time').save!
      study.reload
      study.dependent_variables.should include('reaction time')
    end

    it "should persist independent variables that are added" do
      study.add_independent_variables('thc').save!
      study.reload
      study.independent_variables.should include('thc')
    end
  end

  describe "set_effect_size" do
    it "should raise an exception, if it is not a known statistical test" do
      expect { study.set_effect_size(:banana, 0.3) }
        .to raise_error(Exceptions::InvalidEffectSize)
    end

    it "should set_effect_size, if statistical test is known" do
      study.set_effect_size(:d, 0.3).save!
      study.reload
      study.effect_size[:d].should == 0.3
    end

    it "should only allow for one effect size per study" do
      study.set_effect_size(:d, 0.3)
      study.set_effect_size(:r, 0.3)
      study.save!
      study.reload

      study.effect_size.keys.count.should == 1
    end
  end

  describe "article" do
    it "can lookup an article by the study" do
      study.article.should == article
    end
  end

end
