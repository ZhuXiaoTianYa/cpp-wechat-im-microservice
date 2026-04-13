.PHONY:all rabbitmq_publish rabbitmq_consume
all:rabbitmq_publish rabbitmq_consume
rabbitmq_publish:rabbitmq_publish.cc
	g++ -std=c++17 $^ -o $@ -lamqpcpp -lev -lspdlog -lgflags -lfmt
rabbitmq_consume:rabbitmq_consume.cc
	g++ -std=c++17 $^ -o $@ -lamqpcpp -lev -lspdlog -lgflags -lfmt

.PHONY:clean
clean:
	rm -f rabbitmq_publish rabbitmq_consume