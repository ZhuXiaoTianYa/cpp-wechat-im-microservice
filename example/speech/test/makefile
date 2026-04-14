.PHONY:test
test:asrmain.c common.c token.c
	gcc  $^ -o $@ -lcurl -ljson-c

.PHONY:clean
clean:
	rm -rf test