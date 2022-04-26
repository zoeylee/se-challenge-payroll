FROM python:3.7-slim

RUN python -m pip install --upgrade pip

ENV DOCKER_HOME /home/docker/code
COPY ./backend/ ${DOCKER_HOME}/.
COPY ./deployment/backend/start.sh ${DOCKER_HOME}/.
WORKDIR ${DOCKER_HOME}
RUN python -m pip install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py migrate
RUN python manage.py initadmin

RUN chmod u+x ./start.sh
ENTRYPOINT ["sh"]
CMD ["./start.sh"]