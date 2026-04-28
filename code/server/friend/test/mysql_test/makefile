.PHONY: main
main:main.cc chat_session-odb.cxx friend_apply-odb.cxx relation-odb.cxx chat_session_member-odb.cxx 
	g++ -std=c++17 $^ -o $@ -I../../../odb/ -I./ -lodb-mysql -lodb -lodb-boost -lgflags -lspdlog -lfmt
.PHONY:clean
clean:
	rm -rf main