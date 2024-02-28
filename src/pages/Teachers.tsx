import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Select, Table, TextInput } from "flowbite-react";
import useTeacher from "../app/useTeacher";
import { TeacherType } from "../types/Teacher.types";

const Teachers: React.FC = () => {
  const { loading, error, teachers, getTeachers } = useTeacher();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [editingTeacher, setEditingTeacher] = useState<TeacherType | null>(
    null
  );
  const [editedName, setEditedName] = useState<string>("");
  const [editedUserName, setEditedUserName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedGroup, setEditedGroup] = useState<string>("");

  useEffect(() => {
    getTeachers();
  }, []);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      // Perform delete operation
      await fetch(`http://localhost:3000/teachers/${id}`, {
        method: "DELETE",
      });
      // After successful deletion, fetch updated students list
      getTeachers();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleEdit = (teacher: TeacherType) => {
    setEditingTeacher(teacher);
    setEditedName(teacher.name);
    setEditedUserName(teacher.username);
    setEditedEmail(teacher.email);
    setEditedGroup(teacher.group);
  };

  const saveEditedTeacher = async () => {
    try {
      if (editingTeacher) {
        // Perform update operation
        await fetch(`http://localhost:3000/teachers/${editingTeacher.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
            username: editedUserName,
            email: editedEmail,
            group: editedGroup,
          }),
        });
        // After successful update, fetch updated students list
        getTeachers();
        // Reset editing state
        setEditingTeacher(null);
      }
    } catch (err) {
      console.error("Error updating teacher:", err);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher: TeacherType) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGroup === "" || teacher.group === selectedGroup)
  );

  return (
    <div>
      {loading ? <h2>Loading...</h2> : null}
      <div className="flex justify-between p-3">
        <TextInput
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">All Groups</option>
          <option value="React N32">React N32</option>
          <option value="React N25">React N25</option>
          <option value="React N2">React N2</option>
        </Select>
      </div>
      {filteredTeachers.length > 0 ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>UserName</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Group</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredTeachers.map((teacher: TeacherType) => (
              <Table.Row
                key={teacher.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {editingTeacher === teacher ? (
                    <TextInput
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    teacher.name
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingTeacher === teacher ? (
                    <TextInput
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                    />
                  ) : (
                    teacher.username
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingTeacher === teacher ? (
                    <TextInput
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                  ) : (
                    teacher.email
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingTeacher === teacher ? (
                    <Select
                      value={editedGroup}
                      onChange={(e) => setEditedGroup(e.target.value)}
                    >
                      <option value="React N32">React N32</option>
                      <option value="React N25">React N25</option>
                      <option value="React N2">React N2</option>
                    </Select>
                  ) : (
                    teacher.group
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingTeacher === teacher ? (
                    <Button onClick={saveEditedTeacher}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(teacher)}>Edit</Button>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="failure"
                    onClick={() => handleDelete(teacher.id)}
                    className="font-medium dark:text-red-500"
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : null}
      <Button className="text-center m-auto my-5">
        <Link to="/addteacher">Add Teacher</Link>
      </Button>
      {error ? <h2>{error.message}</h2> : null}
    </div>
  );
};

export default Teachers;
