require 'spec_helper'

describe Finding do
  let(:study) do
    Study.create({
      article_id: 0,
      n: 0,
      power: 0
    })
  end

  describe "create" do
    it "should not allow a finding to be created without a study id" do
      finding = Finding.create({
        url: 'http://www.example.com/foo.txt',
        name: 'finding.txt'
      })

      finding.errors.count.should == 1
      field, error = finding.errors.first
      field.should == :study_id
      error.should == "can't be blank"
    end

    it "should not allow a finding to be created with no name" do
      finding = Finding.create({
        url: 'http://www.example.com/foo.txt',
        study_id: study.id
      })

      finding.errors.count.should == 1
      field, error = finding.errors.first
      field.should == :name
      error.should == "can't be blank"
    end

    it "should not allow a finding to be created with no url" do
      finding = Finding.create({
        name: 'my awesome finding',
        study_id: study.id
      })

      # one for invalid format, 1 for missing.
      finding.errors.count.should == 2
      field, error = finding.errors.first
      field.should == :url
      error.should == "can't be blank"
    end

    it "should not allow article to be created with invalid url" do
      finding = Finding.create({
        name: 'my awesome finding',
        url: 'DERP!',
        study_id: study.id
      })

      finding.errors.count.should == 1
      field, error = finding.errors.first
      field.should == :url
      error.should == 'must be valid url'
    end

  end

  describe "url" do
    it "allows url to have no scheme" do
      finding = Finding.create({
        url: 'www.example.com/foo.txt',
        name: 'hello world',
        study_id: study.id
      })
      finding.errors.count.should == 0
    end

    it "allows url to have scheme" do
      finding = Finding.create({
        url: 'http://www.example.com/foo.txt',
        name: 'hello world',
        study_id: study.id
      })
      finding.errors.count.should == 0

      finding = Finding.create({
        url: 'https://www.example.com/foo.txt',
        name: 'hello world',
        study_id: study.id
      })
      finding.errors.count.should == 0
    end

    it "allows for no subdomain" do
      finding = Finding.create({
        url: 'http://example.com/foo.txt',
        name: 'hello world',
        study_id: study.id
      })
      finding.errors.count.should == 0
    end

    it "allows for no path" do
      finding = Finding.create({
        url: 'http://example.com',
        name: 'hello world',
        study_id: study.id
      })
      finding.errors.count.should == 0
    end

    it "should save a url with no scheme, by adding an http scheme" do
      finding = Finding.create({
        url: 'example.com/foo',
        name: 'hello world',
        study_id: study.id
      })
      finding.reload
      finding.url.should == 'http://example.com/foo'
    end

    it "should not add an http: if there is one already" do
      finding = Finding.create({
        url: 'http://www.example.com/foo',
        name: 'hello world',
        study_id: study.id
      })
      finding.reload
      finding.url.should == 'http://www.example.com/foo'
    end
  end

  describe "study" do
    it "should allow parent study to be fetched" do
      finding = Finding.create({
        url: 'http://www.example.com/foo',
        name: 'hello world',
        study_id: study.id
      })
      finding.study.should == study
    end
  end
end
