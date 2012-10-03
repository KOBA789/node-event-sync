EventSync = require '../'

describe 'EventSync', ->
  describe 'emit an event', ->
    it 'callback is called', (done) ->
      esync = new EventSync()
      esync.sync 'foo', ->
        done()
      setTimeout ->
        esync.open 'foo'
      , 10
    describe 'with args', ->
      it 'callback is called with args', (done) ->
        esync = new EventSync()
        esync.sync 'foo', (arg1, arg2) ->
          arg1.should.equal 'hoge'
          arg2.should.equal 'huga'
          done()
        setTimeout ->
          esync.open 'foo', 'hoge', 'huga'
        , 10
  describe 'emit an event before register callback', ->
    it 'callback is called', (done) ->
      esync = new EventSync()
      esync.open 'bar'
      setTimeout ->
        esync.sync 'bar', ->
          done()
      , 10
    describe 'with args', ->
      it 'callback is called with args', (done) ->
        esync = new EventSync()
        esync.open 'bar', 'hoge', 'huga'
        setTimeout ->
          esync.sync 'bar', (arg1, arg2) ->
            arg1.should.equal 'hoge'
            arg2.should.equal 'huga'
            done()
        , 10
  describe 'emit two events', ->
    describe 'catch by sync', ->
      it 'callback is called twice with each differnt args', (done) ->
        esync = new EventSync()
        flg = false
        esync.sync 'foo', (arg) ->
          arg.should.equal '1st' unless flg
          arg.should.equal '2nd' if flg
          flg = true
          done() if arg is '2nd'
        setTimeout ->
          esync.open 'foo', '1st'
          esync.close 'foo'
          esync.open 'foo', '2nd'
        , 10
    describe 'catch by once', ->
      it 'callback is called once', (done) ->
        esync = new EventSync()
        esync.once 'bar', (arg) ->
          arg.should.equal '1st'
        setTimeout ->
          esync.open 'bar', '1st'
          esync.close 'bar'
          esync.open 'bar', '2nd'
          setTimeout ->
            done()
          , 10
        , 10
  describe 'remove callback between two events', ->
    it 'callback is called once', (done) ->
      esync = new EventSync()
      cb = (arg) ->
        arg.should.equal '1st'
      esync.sync 'bar', cb
      setTimeout ->
        esync.open 'bar', '1st'
        esync.close 'bar'
        esync.unsync 'bar', cb
        esync.open 'bar', '2nd'
        setTimeout ->
          done()
        , 10
  describe 'open twice without closing', ->
    it 'callback is called once', (done) ->
      esync = new EventSync()
      esync.sync 'foo', (arg) ->
        arg.should.equal '1st'
      setTimeout ->
        esync.open 'foo', '1st'
        esync.open 'foo', '2nd'
        setTimeout ->
          done()
        , 10
      , 10