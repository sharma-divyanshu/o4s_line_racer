# O4S Line Racer

All 3 processes `[M, R1, R2]` execute inside their own Docker containers.

## Run instructions:

Before running, [download and install Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/)

Then, pick the version of docker-compose file to run:
* [docker-compose.yaml](https://github.com/sharma-divyanshu/o4s_line_racer/blob/master/docker-compose.yaml) starts the containers for `[M, R1, R2]` and starts the processes. When `racer1` and `racer2` exit, the containers are stopped automatically. The STDOUT from all three processes will be piped to the host.
```bash
$ docker-compose up
```
* [docker-compose_alternative.yaml](https://github.com/sharma-divyanshu/o4s_line_racer/blob/master/docker-compose_alternative.yaml) starts the containers for `[M, R1, R2]` but **does not** start the processes. Manually start all three processes by accessing the containers. _(Run node processes for racer1 and racer2 before running master)_ 
```bash
$ docker-compose -f docker-compose_alternate.yaml up -d
```
  - For `racer1` and `racer2`:
  ```bash
  $ docker exec -it racer1/racer2 bash
  $ node o4s/code/racer.js
  ```
  - For `master`:
```bash
$ docker exec -it master bash
$ node o4s/code/master.js
```
Output of the master (M) process's last run is saved in `/o4s/master.log` on the master container. Each line of the log is of format `[LapNumber.`<code>[(m<sub>1</sub>, c<sub>1</sub>), (m<sub>2</sub>, c<sub>2</sub>)]</code>`, LapStart, LapEnd, TimeToCompletion, AverageLatencyR1, AverageLatencyR2]`, and sorted by the `TimeToCompletion` in ascending order.
