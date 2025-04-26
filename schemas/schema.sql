CREATE TABLE professors (
    professor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pid VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE courses (
    course_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    professor_id INT,
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);

CREATE TABLE teaching_assistants (
    ta_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    pid VARCHAR(100) NOT NULL,
    course_id VARCHAR(20) NOT NULL REFERENCES courses(course_id)  
);

CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    section_id VARCHAR(20),                         
    course_id VARCHAR(20) NOT NULL REFERENCES courses(course_id),                          
    time VARCHAR(10) NOT NULL,                      
    day VARCHAR(10) NOT NULL,                       
    ta_id INT NOT NULL REFERENCES teaching_assistants(ta_id)                          
);

CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    ta_id INT NOT NULL REFERENCES teaching_assistants(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);