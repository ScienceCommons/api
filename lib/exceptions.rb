module Exceptions
  class InvalidEffectSize < StandardError
  end

  class NoInvitesAvailable < StandardError
  end

  class NotOnInviteList < StandardError
  end

  class ErrorWithFields < StandardError
    attr_accessor :field
    def initialize(message, field)
      super(message)
      self.field = field
    end
  end
end
